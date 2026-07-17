const header = document.querySelector("[data-header]");
const copyButton = document.querySelector(".ca-copy");
const navLinks = document.querySelectorAll(".top-nav a");
const sections = ["mission", "chart", "buy", "raids"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

copyButton?.addEventListener("click", async () => {
  const ca = copyButton.dataset.ca || "";
  if (!ca) return;
  const label = copyButton.querySelector("strong");

  try {
    await navigator.clipboard.writeText(ca);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = ca;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }

  if (label) {
    label.textContent = "Copied";
    window.setTimeout(() => {
      label.textContent = "Copy";
    }, 1300);
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });
  },
  { rootMargin: "-28% 0px -58% 0px", threshold: [0.2, 0.45, 0.7] }
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll("[data-copy-line]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copyLine || button.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.left = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }

    const original = button.textContent;
    button.classList.add("is-copied");
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove("is-copied");
    }, 1000);
  });
});
