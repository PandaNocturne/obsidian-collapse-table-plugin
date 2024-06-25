import { Plugin } from 'obsidian';

export default class TableCollapsePlugin extends Plugin {
   // 定义observer属性
  observer: MutationObserver | null = null;

  onload() {
    console.log('加载Table Collapse Plugin');

    // 添加样式
    this.addStyles();

    // 使用MutationObserver监视DOM变化
    this.observeDOM();
  }

  onunload() {
    console.log('卸载Table Collapse Plugin');
    // 停止观察DOM变化
    if (this.observer) {
      this.observer.disconnect();
    }
    // 移除按钮
    const buttons = document.querySelectorAll('.table-collapse-toggle-button');
    buttons.forEach(button => button.remove());
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .hidden-tbody {
        display: none;
      }
      .table-collapse-toggle-button {
        margin-left: 10px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  observeDOM() {
    // 创建一个MutationObserver实例
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          this.addToggleButtons();
        }
      });
    });

    // 配置MutationObserver
    const config = { childList: true, subtree: true };

    // 开始观察特定容器（假设表格在#table-container中）
    const container = document.querySelector('#table-container') || document.body;
    this.observer.observe(container, config);

    // 初始调用，确保现有表格也添加按钮
    this.addToggleButtons();
  }

  addToggleButtons() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const tbody = table.querySelector('tbody');
  
      if (tbody) {
        // 确保图标添加到表格右侧
        let icon = table.querySelector('.table-collapse-toggle-icon') as HTMLElement;
        if (!icon) {
          icon = document.createElement('div');
          icon.classList.add('table-collapse-toggle-icon', 'expanded');
          icon.addEventListener('click', () => {
            if (tbody.classList.contains('hidden-tbody')) {
              tbody.classList.remove('hidden-tbody');
              icon.classList.remove('collapsed');
              icon.classList.add('expanded');
            } else {
              tbody.classList.add('hidden-tbody');
              icon.classList.remove('expanded');
              icon.classList.add('collapsed');
            }
          });
          // 将图标添加到表格右侧
          table.style.position = 'relative'; // 确保表格是相对定位
          table.appendChild(icon);
        }
      }
    });
  }
}
