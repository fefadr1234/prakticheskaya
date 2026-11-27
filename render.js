
const Render = {

    el: {
        tableBody: document.getElementById('payroll-body'),
        cardsContainer: document.getElementById('cards-container'),
        toastContainer: document.getElementById('toast-container')
    },


    renderTable(data) {
        if (!this.el.tableBody) return;
        this.el.tableBody.innerHTML = '';

        if (data.length === 0) {
            this.el.tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted)">Нет данных</td></tr>`;
            return;
        }

        data.forEach(emp => {
            const tr = document.createElement('tr');
            const badgeClass = emp.status === 'Выплачено' ? 'badge-paid' : 'badge-pending';
            
            tr.innerHTML = `
                <td data-label="ID">${emp.id}</td>
                <td data-label="ФИО">${emp.name}</td>
                <td data-label="Должность">${emp.role}</td>
                <td data-label="Статус"><span class="badge ${badgeClass}">${emp.status}</span></td>
                <td data-label="К выплате">${emp.salary}</td>
            `;
   
            tr.addEventListener('click', () => document.dispatchEvent(new CustomEvent('openModal', { detail: emp })));
            this.el.tableBody.appendChild(tr);
        });
    },

    renderCards(data) {
        if (!this.el.cardsContainer) return;
        this.el.cardsContainer.innerHTML = '';

        if (data.length === 0) {
            this.el.cardsContainer.innerHTML = `<p style="color:var(--text-muted)">Нет данных</p>`;
            return;
        }

        data.forEach(emp => {
            const badgeClass = emp.status === 'Выплачено' ? 'badge-paid' : 'badge-pending';
            const card = document.createElement('article');
            card.className = 'card';
            card.tabIndex = 0;
            
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between;">
                    <div>
                        <span style="font-size:12px; color:var(--text-muted)">ID: ${emp.id}</span>
                        <h2 style="font-size:18px;">${emp.name}</h2>
                    </div>
                    <span class="badge ${badgeClass}">${emp.status}</span>
                </div>
                <div style="font-size:14px; color:var(--text-muted)">
                    <p>${emp.role} (${emp.dept})</p>
                </div>
                <div style="margin-top:auto; border-top:1px solid var(--border-color); padding-top:10px; font-size:13px;">
                    К выплате: <strong>${emp.salary}</strong>
                </div>
            `;
            
            card.addEventListener('click', () => document.dispatchEvent(new CustomEvent('openModal', { detail: emp })));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.dispatchEvent(new CustomEvent('openModal', { detail: emp }));
                }
            });
            this.el.cardsContainer.appendChild(card);
        });
    },

    renderAll(data) {
        this.renderTable(data);
        this.renderCards(data);
    },


    renderModalContent(emp) {
        document.getElementById('modal-title').textContent = `Сотрудник: ${emp.name}`;
        document.getElementById('modal-body').innerHTML = `
            <p><strong>ID:</strong> ${emp.id}</p>
            <p><strong>Должность:</strong> ${emp.role}</p>
            <p><strong>Департамент:</strong> ${emp.dept}</p>
            <p><strong>Статус:</strong> ${emp.status}</p>
            <p><strong>К выплате:</strong> ${emp.salary}</p>
        `;
    },


    renderAddForm() {
        document.getElementById('modal-title').textContent = 'Добавить сотрудника';
        document.getElementById('modal-body').innerHTML = `
            <form id="add-form" style="display:flex; flex-direction:column; gap:10px;">
                <div>
                    <label for="new-name">ФИО:</label>
                    <input type="text" id="new-name" required style="width:100%; padding:8px; margin-top:4px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-main);">
                </div>
                <div>
                    <label for="new-role">Должность:</label>
                    <input type="text" id="new-role" required style="width:100%; padding:8px; margin-top:4px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-main);">
                </div>
                <div>
                    <label for="new-salary">Оклад (число):</label>
                    <input type="number" id="new-salary" required style="width:100%; padding:8px; margin-top:4px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-main);">
                </div>
            </form>
        `;
        document.getElementById('modal-footer').innerHTML = `
            <button class="btn btn-secondary" id="modal-cancel">Отмена</button>
            <button class="btn btn-accent" id="save-employee-btn">Сохранить</button>
        `;
    }
};
