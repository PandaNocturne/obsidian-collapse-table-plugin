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
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => button.remove());
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .hidden-tbody {
        display: none;
      }
      .toggle-button {
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
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');

      if (thead && tbody) {
        // 确保按钮添加到thead的第一个tr中
        const firstRow = thead.querySelector('tr');

        if (firstRow) {
          let button = firstRow.querySelector('.toggle-button');
          if (!button) {
            button = document.createElement('button');
            button.textContent = '折叠';
            button.classList.add('toggle-button');
            button.addEventListener('click', () => {
              if (tbody.classList.contains('hidden-tbody')) {
                tbody.classList.remove('hidden-tbody');
                button!.textContent = '折叠';
              } else {
                tbody.classList.add('hidden-tbody');
                button!.textContent = '展开';
              }
            });
            // 将按钮添加到第一个tr的最后
            firstRow.appendChild(button);
          }
        }
      }
    });
  }
}
