/* Contact form. Sends through the portfolio Express backend. */
$("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.target;
  const status = $("st");
  const button = form.querySelector("button");
  const data = Object.fromEntries(new FormData(form));
  const mailAddress = "tejavathsrikanth60@gmail.com";

  const openEmailApp = () => {
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(
      `${data.message}\n\nFrom: ${data.name}\nEmail: ${data.email}`
    );
    window.location.href = `mailto:${mailAddress}?subject=${subject}&body=${body}`;
  };

  button.disabled = true;
  status.textContent = "Sending\u2026";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "The message could not be sent.");
    }

    status.textContent = result.message;
    form.reset();
  } catch (error) {
    status.textContent = "The server could not send this message. Opening your email app as a fallback.";
    openEmailApp();
  } finally {
    button.disabled = false;
  }
});
