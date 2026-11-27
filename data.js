document.addEventListener('DOMContentLoaded', () => {
    

    const employeesData = [
        { id: 101, name: 'Иванов Иван Иванович', role: 'Frontend Developer', dept: 'IT', status: 'Выплачено', salary: '120 000 ₽' },
        { id: 102, name: 'Петрова Анна Сергеевна', role: 'HR Manager', dept: 'HR', status: 'В ожидании', salary: '80 000 ₽' },
        { id: 103, name: 'Сидоров Олег Петрович', role: 'UI/UX Designer', dept: 'Design', status: 'Выплачено', salary: '95 000 ₽' },
        { id: 104, name: 'Смирнова Ольга Викторовна', role: 'Backend Developer', dept: 'IT', status: 'В ожидании', salary: '140 000 ₽' },
        { id: 105, name: 'Кузнецов Артем Дмитриевич', role: 'Recruiter', dept: 'HR', status: 'Выплачено', salary: '70 000 ₽' }
    ];

   
    const tableBody = document.getElementById('payroll-body'); 
    const cardsContainer = document.getElementById('cards-container');
    const tableContainer = document.getElementById('table-container');
    

    const searchInput = document.getElementById('search');
    const statusFilter = document.getElementById('status-filter');
    const deptCheckboxes = document.querySelectorAll('.custom-checkboxes input[type="checkbox"]');
    const resetBtn = document.getElementById('reset-btn');

    const viewTableRadio = document.getElementById('view-table');
    const viewCardsRadio = document.getElementById('view-cards');


    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    let previousActiveElement = null;

    function renderTable(data) {
        if (!tableBody) {
            console.error("КРИТИЧЕСКАЯ ОШИБКА: Элемент tbody с id='payroll-body' не найден!");
            return;
        }

        tableBody.innerHTML = ''; 

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">Нет данных для отображения</td></tr>`;
            return;
        }

        data.forEach(emp => {
            const tr = document.createElement('tr');
            const badgeClass = emp.status === 'Выплачено' ? 'badge-paid' : 'badge-pending';
            
     
            tr.innerHTML = `
                <td data-label="ID">${emp.id}</td>
                <td data-label="ФИО Сотрудника">${emp.name}</td>
                <td data-label="Должность">${emp.role}</td>
                <td data-label="Статус"><span class="badge ${badgeClass}">${emp.status}</span></td>
                <td data-label="К выплате">${emp.salary}</td>
            `;
            tr.addEventListener('click', () => openModal(emp));
            tableBody.appendChild(tr);
        });
    }

    function renderCards(data) {
        cardsContainer.innerHTML = '';
        
        if (data.length === 0) {
            cardsContainer.innerHTML = `<p>Нет данных для отображения</p>`;
            return;
        }

        data.forEach(emp => {
            const badgeClass = emp.status === 'Выплачено' ? 'badge-paid' : 'badge-pending';
            const card = document.createElement('article');
            card.className = 'card interactive';
            card.tabIndex = 0;
            
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <span class="card-id">ID: ${emp.id}</span>
                        <h2 class="card-title">${emp.name}</h2>
                    </div>
                    <span class="badge ${badgeClass}">${emp.status}</span>
                </div>
                <div class="card-body">
                    <p><strong>Должность:</strong> ${emp.role}</p>
                    <p><strong>Департамент:</strong> ${emp.dept}</p>
                </div>
                <div class="card-meta">
                    <span>К выплате: <strong>${emp.salary}</strong></span>
                </div>
            `;
            
            card.addEventListener('click', () => openModal(emp));

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(emp);
                }
            });

            cardsContainer.appendChild(card);
        });
    }


    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        

        const selectedDepts = Array.from(deptCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const filteredData = employeesData.filter(emp => {

            const matchesSearch = emp.name.toLowerCase().includes(searchTerm);

            const matchesStatus = statusValue === 'all' || emp.status === statusValue;

            const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(emp.dept);

            return matchesSearch && matchesStatus && matchesDept;
        });

        renderTable(filteredData);
        renderCards(filteredData);
    }

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    deptCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));


    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = 'all';
        deptCheckboxes.forEach(cb => cb.checked = false);
        applyFilters();
    });


    viewTableRadio.addEventListener('change', () => {
        tableContainer.classList.add('active');
        cardsContainer.classList.remove('active');
    });
    viewCardsRadio.addEventListener('change', () => {
        cardsContainer.classList.add('active');
        tableContainer.classList.remove('active');
    });


    function openModal(emp) {
        previousActiveElement = document.activeElement;
        
        modalTitle.textContent = `Сотрудник: ${emp.name}`;
        modalBody.innerHTML = `
            <p><strong>ID:</strong> ${emp.id}</p>
            <p><strong>Должность:</strong> ${emp.role}</p>
            <p><strong>Департамент:</strong> ${emp.dept}</p>
            <p><strong>Статус:</strong> ${emp.status}</p>
            <p><strong>Сумма к выплате:</strong> ${emp.salary}</p>
        `;
        
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open'); 
        modalCloseBtn.focus(); 
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
        if (previousActiveElement) previousActiveElement.focus(); 
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });


    document.addEventListener('keydown', (e) => {
        if (!modalOverlay.classList.contains('active')) return;

        if (e.key === 'Escape') closeModal();

        if (e.key === 'Tab') {
            const focusableElements = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });



    applyFilters(); 
});
