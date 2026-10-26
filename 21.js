let draggedTicketId = null;
let activeTicketId = null;
const ticketTechnicians = new Map();

function dragStart(event) {
    draggedTicketId = event.currentTarget.id;
    event.dataTransfer.setData('text/plain', draggedTicketId);
    event.dataTransfer.effectAllowed = 'move';
}

// Cho phép thả
function allowDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    dropzone.classList.add('drag-over');
}

function removeDropStyle(event) {
    const dropzone = event.currentTarget;
    dropzone.classList.remove('drag-over');
}

// Xử lý khi thả thẻ vào cột mới
function dropTicket(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    dropzone.classList.remove('drag-over');

    const ticketId = event.dataTransfer.getData('text/plain') || draggedTicketId;
    const ticketElement = document.getElementById(ticketId);
    if (ticketElement) {
        dropzone.appendChild(ticketElement);
        if (dropzone.id === 'col-1') {
            const technicianId = ticketTechnicians.get(ticketId);
            if (technicianId) {
                updateTechnicianWorkload(technicianId, -10);
                ticketTechnicians.delete(ticketId);
            }
        }
        updateTicketCounts();
    }
}

function assignTicketToTechnician(event, technicianId) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    const ticketId = event.dataTransfer.getData('text/plain') || draggedTicketId;
    assignTicket(ticketId, technicianId);
}

function assignTicket(ticketId, technicianId) {
    const ticketElement = document.getElementById(ticketId);
    const assignedColumn = document.getElementById('col-2');

    if (!ticketElement || !assignedColumn || !technicianId) return;

    const previousTechnicianId = ticketTechnicians.get(ticketId);
    if (previousTechnicianId !== technicianId) {
        if (previousTechnicianId) updateTechnicianWorkload(previousTechnicianId, -10);
        updateTechnicianWorkload(technicianId, 10);
        ticketTechnicians.set(ticketId, technicianId);
    }

    assignedColumn.appendChild(ticketElement);
    updateTicketCounts();
}

function updateTechnicianWorkload(technicianId, change) {
    const loadLabel = document.getElementById(`${technicianId}-load`);
    const loadBar = document.getElementById(`${technicianId}-load-bar`);
    if (!loadLabel || !loadBar) return;

    const currentLoad = Number(loadLabel.dataset.load);
    const nextLoad = Math.max(0, Math.min(100, currentLoad + change));
    loadLabel.dataset.load = nextLoad;
    loadLabel.textContent = `Tải công việc ${nextLoad}%`;
    loadBar.style.width = `${nextLoad}%`;
}

// Cập nhật số lượng trên tiêu đề cột
function updateTicketCounts() {
    document.getElementById('count-col-1').textContent = document.getElementById('col-1').children.length;
    document.getElementById('count-col-2').textContent = document.getElementById('col-2').children.length;
    document.getElementById('count-col-3').textContent = document.getElementById('col-3').children.length;
}

// Mở Drawer chi tiết phân công
function openTicketDetail(ticketId) {
    const modal = document.getElementById('ticketModal');
    const modalContent = document.getElementById('modalContent');
    const titleEl = document.getElementById('modalTicketTitle');

    activeTicketId = ticketId;
    titleEl.textContent = `Phân công ${ticketId}`;
    modal.classList.remove('hidden');
    
    setTimeout(() => {
        modalContent.classList.remove('translate-x-full');
    }, 10);
}

// Đóng Drawer chi tiết phân công
function closeTicketDetail() {
    const modal = document.getElementById('ticketModal');
    const modalContent = document.getElementById('modalContent');

    modalContent.classList.add('translate-x-full');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function confirmTicketAssignment() {
    const technicianId = document.getElementById('assignedTechnician').value;
    assignTicket(activeTicketId, technicianId);
    activeTicketId = null;
    closeTicketDetail();
}

// Đóng khi click ra vùng tối ngoài modal
window.addEventListener('click', function(e) {
    const modal = document.getElementById('ticketModal');
    if (e.target === modal) {
        closeTicketDetail();
    }
});