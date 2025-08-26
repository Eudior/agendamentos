document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('event-modal');
    const addEventBtn = document.getElementById('add-event-btn');
    const closeBtn = document.querySelector('.close-button');
    const eventForm = document.getElementById('event-form');

    const PIXELS_PER_HOUR = 60;
    const CALENDAR_START_HOUR = 7;

    // Abrir o modal
    addEventBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
        eventForm.reset();
    };

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Lidar com o envio do formulário
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('event-title').value;
        const startDateTime = new Date(document.getElementById('event-date').value);
        const duration = parseFloat(document.getElementById('event-duration').value);
        const location = document.getElementById('event-location').value;
        const professionals = document.getElementById('event-professionals').value;

        addEventToCalendar({
            title,
            startDateTime,
            duration,
            location,
            professionals,
        });
        
        closeModal();
    });

    function addEventToCalendar(event) {
        // Obter o dia da semana (0=Domingo, 1=Segunda, ...)
        const dayOfWeek = event.startDateTime.getDay();
        
        // Encontrar a coluna correta do dia
        const dayColumn = document.getElementById(`day-${dayOfWeek}`);
        if (!dayColumn) {
            console.error('Coluna do dia não encontrada para:', dayOfWeek);
            return;
        }

        // Criar o elemento do evento
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';

        // Calcular posição e altura
        const startHour = event.startDateTime.getHours();
        const startMinute = event.startDateTime.getMinutes();
        
        const topPosition = (startHour - CALENDAR_START_HOUR + (startMinute / 60)) * PIXELS_PER_HOUR;
        const height = event.duration * PIXELS_PER_HOUR;

        eventElement.style.top = `${topPosition}px`;
        eventElement.style.height = `${height}px`;

        // Preencher o conteúdo do evento
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

        dayColumn.appendChild(eventElement);
    }
    
    // Exemplo de agendamento para visualização inicial
    addEventToCalendar({
        title: "Instalação Fibra Óptica",
        startDateTime: getExampleDate(2, 9), // Terça-feira às 9h
        duration: 2.5,
        location: "https://maps.app.goo.gl/exemplo",
        professionals: 2
    });
    
    addEventToCalendar({
        title: "Manutenção de Servidor",
        startDateTime: getExampleDate(4, 14), // Quinta-feira às 14h
        duration: 3,
        location: "https://maps.app.goo.gl/exemplo2",
        professionals: 1
    });

    // Função auxiliar para criar datas de exemplo na semana atual
    function getExampleDate(dayOfWeek, hour) {
        const now = new Date();
        const currentDay = now.getDay(); // 0=Dom, 1=Seg
        const distance = dayOfWeek - (currentDay === 0 ? 7 : currentDay); // Ajusta para semana começar na segunda
        
        const date = new Date(now.setDate(now.getDate() + distance));
        date.setHours(hour, 0, 0, 0);
        return date;
    }
});
