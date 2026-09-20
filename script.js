const FORM_CONFIG = {
  endpoint: "https://docs.google.com/forms/d/e/1FAIpQLSdMIEpUKkQnPqjSZ-h0lveJL3f8PZOj057oSANz4HHtiXEzzw/formResponse",
  fields: {
    name: "entry.1854338523",
    email: "entry.856945067",
    phone: "entry.624032851",
    town: "entry.2045623038",
    interest: "entry.1729713599",
    message: "entry.230931445"
  }
};

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".primary-nav");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
nav?.addEventListener("click", () => {
  menuButton?.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
});

const form = document.querySelector("#campaign-form");
const status = document.querySelector("#form-status");
const responseFrame = document.querySelector("[name='form-response-frame']");
let awaitingResponse = false;

if (form) {
  form.action = FORM_CONFIG.endpoint;
  for (const [localName, remoteName] of Object.entries(FORM_CONFIG.fields)) {
    const control = form.elements.namedItem(localName);
    if (control) control.name = remoteName;
  }

  form.addEventListener("submit", (event) => {
    const honeypot = form.elements.namedItem("website");
    if (honeypot?.value) {
      event.preventDefault();
      return;
    }
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      status.textContent = "Please complete the required fields.";
      status.className = "form-status error";
      return;
    }
    awaitingResponse = true;
    status.textContent = "Sending…";
    status.className = "form-status";
  });
}

responseFrame?.addEventListener("load", () => {
  if (!awaitingResponse) return;
  awaitingResponse = false;
  form.reset();
  status.textContent = "Thank you. Your message was sent to the campaign.";
  status.className = "form-status success";
});

const dialog = document.querySelector("#interest-dialog");
const dialogContinue = document.querySelector("#dialog-continue");
document.querySelectorAll(".form-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const interest = form?.elements.namedItem(FORM_CONFIG.fields.interest);
    if (interest) interest.value = button.dataset.interest || "Campaign updates";
    if (dialog?.showModal) dialog.showModal();
    else document.querySelector("#contact")?.scrollIntoView();
  });
});
document.querySelector(".dialog-close")?.addEventListener("click", () => dialog?.close());
dialogContinue?.addEventListener("click", () => {
  dialog?.close();
  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form?.querySelector("input")?.focus(), 350);
});
