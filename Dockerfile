# Base images are pinned by digest (tag kept for readability). Update both deliberately: docker buildx imagetools inspect <tag>.
FROM oven/bun:1@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM node:24-bookworm-slim@sha256:01d566e8d94d8c619591d78652babfccd3c6992a3dffa9ed5ab39e11cf6c70e9

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN groupadd --system --gid 10001 app \
    && useradd --system --uid 10001 --gid app --create-home app

# Self-hosted neural text-to-speech for the public assistant: Piper 2023.11.14-2 (MIT; bundles espeak-ng, run as a separate process)
# and the en_US "john" male voice (public-domain LibriVox training data). Every download is pinned by SHA-256.
ADD --checksum=sha256:a50cb45f355b7af1f6d758c1b360717877ba0a398cc8cbe6d2a7a3a26e225992 https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz /tmp/piper.tar.gz
ADD --checksum=sha256:789c6c875726e627ddee93d51d8727859abe9c091c3d141591f4b83c2072e988 https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/john/medium/en_US-john-medium.onnx /tmp/voice.onnx
ADD --checksum=sha256:af60f177b6b550f3d7a302720c0fb89e7f94a82b5dca464775ef63b1c69ba09a https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/john/medium/en_US-john-medium.onnx.json /tmp/voice.onnx.json
RUN tar -xzf /tmp/piper.tar.gz -C /opt     && mkdir -p /opt/piper/voices     && mv /tmp/voice.onnx /opt/piper/voices/en_US-john-medium.onnx     && mv /tmp/voice.onnx.json /opt/piper/voices/en_US-john-medium.onnx.json     && rm /tmp/piper.tar.gz     && chmod -R a+rX /opt/piper

WORKDIR /app
COPY --from=build --chown=app:app /app/.output /app/.output

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
