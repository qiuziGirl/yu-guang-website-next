document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("[data-dropdown]");
  let activeDropdown = null;

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const dropdownName = item.getAttribute("data-dropdown");
      const dropdown = item.parentElement.querySelector(
        `.${dropdownName}-menu`
      );

      // 如果点击的是当前打开的下拉菜单，则关闭它
      if (dropdown.classList.contains("active")) {
        dropdown.classList.remove("active");
        activeDropdown = null;
        return;
      }

      // 关闭其他打开的下拉菜单
      if (activeDropdown) {
        activeDropdown.classList.remove("active");
      }

      // 打开当前下拉菜单
      dropdown.classList.add("active");
      activeDropdown = dropdown;
      e.stopPropagation();
    });
  });

  // 点击页面其他地方关闭下拉菜单
  document.addEventListener("click", () => {
    if (activeDropdown) {
      activeDropdown.classList.remove("active");
      activeDropdown = null;
    }
  });
});
