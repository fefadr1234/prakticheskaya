
const App = {
    data: [
        { id: 101, name: 'Иванов Иван', role: 'Frontend Developer', dept: 'IT', status: 'Выплачено', salary: '120 000 ₽' },
        { id: 102, name: 'Петрова Анна', role: 'HR Manager', dept: 'HR', status: 'В ожидании', salary: '80 000 ₽' },
        { id: 103, name: 'Сидоров Олег', role: 'UI/UX Designer', dept: 'Design', status: 'Выплачено', salary: '95 000 ₽' }
    ],

    ui: {
        search: document.getElementById('search'),
        statusFilter: document.getElementById('status-filter'),
        depts: document.querySelectorAll('.custom-checkboxes input'),
        resetBtn: document.getElementById('reset-btn'),
        addBtn: document.getElementById('add-employee-btn'),
        radiosView: document.querySelectorAll('input[name="view"]'),
        tableContainer: document.getElementById('table-container'),
        cardsContainer: document.getElementById('cards-container'),
        

        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('sidebar-overlay'),
        menuToggle: document.getElementById('menu-toggle'),
        
        // Аккордеон
        accordionTrigger: document.getElementById('accordion-trigger'),
        filtersContent: document.getElementById('filters-content'),

        modal: document.getElementById('modal-overlay'),
        modalFooter: document.getElementById('modal-footer'),


        themeSelect: document.getElementById('theme-select'),
        accentPicker: document.getElementById('accent-picker')
    },

    prevActiveElement: null,

    init() {
        this.initTheme();
        this.bindEvents();
        this.applyFilters();
    },


    initTheme() {
    
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.ui.themeSelect.value = currentTheme;
        

        const savedColor = localStorage.getItem('accentColor') || '#0d6efd';
        this.ui.accentPicker.value = savedColor;
        this.updateAccentColor(savedColor);


        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) { 
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                this.ui.themeSelect.value = newTheme;
            }
        });
    },

    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        Render.showToast(`Тема изменена на "${this.ui.themeSelect.options[this.ui.themeSelect.selectedIndex].text}"`);
    },


    updateAccentColor(hex) {

        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        document.documentElement.style.setProperty('--accent-color', hex);
        document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
        

        document.documentElement.style.setProperty('--accent-hover', `rgba(${Math.max(0, r-30)}, ${Math.max(0, g-30)}, ${Math.max(0, b-30)}, 1)`);
        
        localStorage.setItem('accentColor', hex);
    },


    bindEvents() {

        this.ui.search.addEventListener('input', () => this.applyFilters());
        this.ui.statusFilter.addEventListener('change', () => this.applyFilters());
        this.ui.depts.forEach(cb => cb.addEventListener('change', () => this.applyFilters()));
        

        this.ui.resetBtn.addEventListener('click', () => {
            this.ui.search.value = '';
            this.ui.statusFilter.value = 'all';
            this.ui.depts.forEach(cb => cb.checked = false);
            this.applyFilters();
            Render.showToast('Фильтры сброшены');
        });

 
        this.ui.radiosView.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'table') {
                    this.ui.tableContainer.classList.add('active');
                    this.ui.cardsContainer.classList.remove('active');
                } else {
                    this.ui.cardsContainer.classList.add('active');
                    this.ui.tableContainer.classList.remove('active');
                }
            });
        });


        this.ui.themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        this.ui.accentPicker.addEventListener('input', (e) => this.updateAccentColor(e.target.value));


        this.ui.menuToggle.addEventListener('click', () => this.toggleMenu());
        this.ui.overlay.addEventListener('click', () => this.toggleMenu(false));

      
        this.ui.accordionTrigger.addEventListener('click', () => {
            const expanded = this.ui.accordionTrigger.getAttribute('aria-expanded') === 'true';
            this.ui.accordionTrigger.setAttribute('aria-expanded', !expanded);
            this.ui.filtersContent.classList.toggle('active');
            this.ui.filtersContent.setAttribute('aria-hidden', expanded);
        });


        document.addEventListener('openModal', (e) => this.openModal(e.detail));


        this.ui.addBtn.addEventListener('click', () => {
            Render.renderAddForm();
            this.openModal();
            document.getElementById('save-employee-btn').addEventListener('click', () => this.saveEmployee());
        });


        document.getElementById('modal-close-btn').addEventListener('click', () => this.closeModal());
        this.ui.modal.addEventListener('click', (e) => {
            if (e.target === this.ui.modal) this.closeModal();
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.ui.modal.classList.contains('active')) this.closeModal();
                if (this.ui.sidebar.classList.contains('open')) this.toggleMenu(false);
            }
        });
    },

    applyFilters() {
        const term = this.ui.search.value.toLowerCase();
        const status = this.ui.statusFilter.value;
        const selectedDepts = Array.from(this.ui.depts).filter(cb => cb.checked).map(cb => cb.value);

        const filtered = this.data.filter(emp => {
            const matchName = emp.name.toLowerCase().includes(term);
            const matchStatus = status === 'all' || emp.status === status;
            const matchDept = selectedDepts.length === 0 || selectedDepts.includes(emp.dept);
            return matchName && matchStatus && matchDept;
        });

        Render.renderAll(filtered);
    },

    toggleMenu(forceState) {
        const isOpen = forceState !== undefined ? forceState : !this.ui.sidebar.classList.contains('open');
        this.ui.sidebar.classList.toggle('open', isOpen);
        this.ui.overlay.classList.toggle('active', isOpen);
        this.ui.menuToggle.setAttribute('aria-expanded', isOpen);
    },

    openModal(emp = null) {
        this.prevActiveElement = document.activeElement;
        
        if (emp) {
            Render.renderModalContent(emp);

            this.ui.modalFooter.innerHTML = `<button class="btn btn-secondary" id="modal-cancel">Закрыть</button>`;
            document.getElementById('modal-cancel').addEventListener('click', () => this.closeModal());
        }
        
        this.ui.modal.classList.add('active');
        document.body.classList.add('modal-open');
        
 
        const focusTarget = this.ui.modal.querySelector('input, button');
        if (focusTarget) focusTarget.focus();
    },

    closeModal() {
        this.ui.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        if (this.prevActiveElement) this.prevActiveElement.focus();
    },


    saveEmployee() {
        const form = document.getElementById('add-form');
        if (!form.checkValidity()) {
            form.reportValidity(); 
            Render.showToast('Заполните все обязательные поля!');
            return;
        }

        const newEmp = {
            id: Math.floor(Math.random() * 1000) + 200,
            name: document.getElementById('new-name').value,
            role: document.getElementById('new-role').value,
            salary: `${document.getElementById('new-salary').value} ₽`,
            dept: 'IT', 
            status: 'В ожидании' 
        };

        this.data.push(newEmp);
        this.applyFilters();
        this.closeModal();
        Render.showToast('Сотрудник успешно добавлен!');
    }
};


document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
