document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const modal = document.getElementById('event-modal');
    const addEventBtn = document.getElementById('add-event-btn');
    const closeBtn = document.querySelector('.close-button');
    const eventForm = document.getElementById('event-form');
    const deleteEventBtn = document.getElementById('delete-event-btn');
    const modalTitle = document.getElementById('modal-title');
    const saveEventBtn = document.getElementById('save-event-btn');
    const hiddenEventId = document.getElementById('event-id');

    // Constantes do calendário
    const PIXELS_PER_HOUR = 60;
    const CALENDAR_START_HOUR = 7;

    // --- ABRIR E FECHAR MODAL ---

    // Abrir modal para NOVO evento
    addEventBtn.addEventListener('click', () => {
        resetModal();
        modal.style.display = 'flex';
    });

    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Função para resetar o formulário para o estado de "Novo Evento"
    function resetModal() {
        eventForm.reset();
        hiddenEventId.value = '';
        modalTitle.textContent = 'Novo Agendamento';
        saveEventBtn.textContent = 'Agendar';
        deleteEventBtn.style.display = 'none';
    }
    
    // --- LÓGICA DE EVENTOS (CRIAR, EDITAR, DELETAR) ---

    // Lidar com o envio do formulário (Criar ou Salvar Alterações)
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const eventId = hiddenEventId.value;
        const title = document.getElementById('event-title').value;
        const startDateTime = new Date(document.getElementById('event-date').value);
        const duration = parseFloat(document.getElementById('event-duration').value);
        const location = document.getElementById('event-location').value;
        const professionals = document.getElementById('event-professionals').value;
        
        // Se estivermos editando, remove o evento antigo primeiro
        if (eventId) {
            const oldEventElement = document.getElementById(eventId);
            if (oldEventElement) {
                oldEventElement.remove();
            }
        }

        addEventToCalendar({
            id: eventId || `event-${Date.now()}`, // Reutiliza ID se existir, senão cria um novo
            title,
            startDateTime,
            duration,
            location,
            professionals,
        });
        
        closeModal();
    });

    // Lidar com o clique no botão de deletar
    deleteEventBtn.addEventListener('click', () => {
        const eventId = hiddenEventId.value;
        if (!eventId) return;

        if (confirm('Tem certeza que deseja excluir este agendamento?')) {
            const eventElement = document.getElementById(eventId);
            if (eventElement) {
                eventElement.remove();
            }
            closeModal();
        }
    });

    // Função principal que desenha o evento no calendário
    function addEventToCalendar(event) {
        const dayOfWeek = event.startDateTime.getDay();
        const dayColumn = document.getElementById(`day-${dayOfWeek}`);
        if (!dayColumn) return;

        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.id = event.id;

        // Armazena todos os dados no próprio elemento para fácil edição
        eventElement.dataset.title = event.title;
        eventElement.dataset.start = event.startDateTime.toISOString();
        eventElement.dataset.duration = event.duration;
        eventElement.dataset.location = event.location;
        eventElement.dataset.professionals = event.professionals;

        const startHour = event.startDateTime.getHours();
        const startMinute = event.startDateTime.getMinutes();
        const topPosition = (startHour - CALENDAR_START_HOUR + (startMinute / 60)) * PIXELS_PER_HOUR;
        const height = event.duration * PIXELS_PER_HOUR;

        eventElement.style.top = `${topPosition}px`;
        eventElement.style.height = `${height}px`;

        eventElement.innerHTML = `
            <span class="title">${event.title}</span>
            <span class="address">
                <i class="fas fa-map-marker-alt"></i>
                <a href="${event.location}" target="_blank" rel="noopener noreferrer">Ver Endereço</a>
            </span>
            <span class="professionals">
                <i class="fas fa-users"></i> ${event.professionals}
            </span>
        `;
        
        // Adiciona o listener para abrir o modo de edição ao clicar
        eventElement.addEventListener('click', () => openEditModal(eventElement));

        dayColumn.appendChild(eventElement);
    }
    
    // Função para abrir o modal em modo de edição
    function openEditModal(eventElement) {
        resetModal(); // Começa com um modal limpo

        // Preenche o formulário com os dados do evento clicado
        hiddenEventId.value = eventElement.id;
        document.getElementById('event-title').value = eventElement.dataset.title;
        // Formato para 'datetime-local' é YYYY-MM-DDTHH:MM
        document.getElementById('event-date').value = eventElement.dataset.start.slice(0, 16);
        document.getElementById('event-duration').value = eventElement.dataset.duration;
        document.getElementById('event-location').value = eventElement.dataset.location;
        document.getElementById('event-professionals').value = eventElement.dataset.professionals;

        // Altera a aparência do modal para "Edição"
        modalTitle.textContent = 'Editar Agendamento';
        saveEventBtn.textContent = 'Salvar Alterações';
        deleteEventBtn.style.display = 'block'; // Mostra o botão de excluir
        
        modal.style.display = 'flex';
    }

    // --- DADOS DE EXEMPLO INICIAIS ---
    function getExampleDate(dayOfWeek, hour) {
        const now = new Date();
        const currentDay = now.getDay();
        const distance = dayOfWeek - (currentDay === 0 ? 7 : currentDay);
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + distance);
        date.setHours(hour, 0, 0, 0);
        return date;
    }

    addEventToCalendar({
        id: `event-example-1`,
        title: "Instalação Fibra Óptica",
        startDateTime: getExampleDate(2, 9),
        duration: 2.5,
        location: "https://maps.app.goo.gl/exemplo",
        professionals: 2
    });
    
    addEventToCalendar({
        id: `event-example-2`,
        title: "Manutenção de Servidor",
        startDateTime: getExampleDate(4, 14),
        duration: 3,
        location: "https://maps.app.goo.gl/exemplo2",
        professionals: 1
    });
});
