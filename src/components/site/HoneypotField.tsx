/**
 * Anti-automation honeypot. Hidden from sighted users and assistive technology and removed from the
 * tab order; automated form fillers that populate every field reveal themselves to /api/forms, which
 * acknowledges the submission without delivering it.
 */
export function HoneypotField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor="nova-website-url">Leave this field empty</label>
      <input
        id="nova-website-url"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
