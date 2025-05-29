document.addEventListener('DOMContentLoaded', function() {
    setupQuestSystem();
    loadQuests();
    checkOverdueQuests(); // Check for overdue quests periodically
});

let quests = JSON.parse(localStorage.getItem('quests')) || [];

function setupQuestSystem() {
    const skillsSection = document.getElementById('skills');
    
    if (skillsSection) {
        const content = skillsSection.querySelector('.content');
        
        // Create quest board
        const questBoard = document.createElement('div');
        questBoard.className = 'quest-board';
        questBoard.innerHTML = `
            <div class="quest-header">
                <h3>MY QUESTS</h3>
                <button class="quest-button" id="addQuestBtn">Add New Quest</button>
            </div>
            <div class="quest-tabs">
                <button class="quest-tab active" data-tab="active">Active Quests</button>
                <button class="quest-tab" data-tab="overdue">Overdue Quests</button>
                <button class="quest-tab" data-tab="completed">Completed Quests</button>
            </div>
            <div id="activeQuests" class="quest-list"></div>
            <div id="overdueQuests" class="quest-list" style="display: none;"></div>
            <div id="completedQuests" class="quest-list" style="display: none;"></div>
        `;
        
        // Create add quest modal
        const addQuestModal = document.createElement('div');
        addQuestModal.className = 'quest-modal';
        addQuestModal.id = 'addQuestModal';
        addQuestModal.innerHTML = `
            <div class="quest-modal-content">
                <h3>Add New Quest</h3>
                <input type="text" id="questTitle" placeholder="Quest Title" class="quest-input">
                <textarea id="questDescription" placeholder="Quest Description" class="quest-input"></textarea>
                <input type="datetime-local" id="questDeadline" class="quest-input">
                <select id="questType" class="quest-input">
                    <option value="academic">Academic</option>
                    <option value="adventure">Adventure</option>
                    <option value="coding">Coding</option>
                    <option value="personal">Personal</option>
                </select>
                <div class="quest-modal-buttons">
                    <button id="addQuestSubmitBtn" class="quest-button">Add Quest</button>
                    <button id="addQuestCancelBtn" class="quest-button cancel">Cancel</button>
                </div>
            </div>
        `;
        
        content.appendChild(questBoard);
        document.body.appendChild(addQuestModal);

        // Add event listeners
        const addQuestBtn = document.getElementById('addQuestBtn');
        const addQuestSubmitBtn = document.getElementById('addQuestSubmitBtn');
        const addQuestCancelBtn = document.getElementById('addQuestCancelBtn');
        const questTabs = document.querySelectorAll('.quest-tab');

        if (addQuestBtn) {
            addQuestBtn.addEventListener('click', openAddQuestModal);
        }

        if (addQuestSubmitBtn) {
            addQuestSubmitBtn.addEventListener('click', addQuest);
        }

        if (addQuestCancelBtn) {
            addQuestCancelBtn.addEventListener('click', closeAddQuestModal);
        }

        questTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.getAttribute('data-tab');
                showQuestTab(tabType);
                questTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }
}

function showQuestTab(tab) {
    const activeQuests = document.getElementById('activeQuests');
    const overdueQuests = document.getElementById('overdueQuests');
    const completedQuests = document.getElementById('completedQuests');
    
    if (activeQuests && overdueQuests && completedQuests) {
        activeQuests.style.display = 'none';
        overdueQuests.style.display = 'none';
        completedQuests.style.display = 'none';

        switch(tab) {
            case 'active':
                activeQuests.style.display = 'flex';
                break;
            case 'overdue':
                overdueQuests.style.display = 'flex';
                break;
            case 'completed':
                completedQuests.style.display = 'flex';
                break;
        }
    }
}

function openAddQuestModal() {
    const modal = document.getElementById('addQuestModal');
    if (modal) {
        // Set minimum date to today
        const deadlineInput = document.getElementById('questDeadline');
        if (deadlineInput) {
            const now = new Date();
            const tzoffset = now.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,16);
            deadlineInput.min = localISOTime;
        }
        modal.style.display = 'flex';
    }
}

function closeAddQuestModal() {
    const modal = document.getElementById('addQuestModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function addQuest() {
    const title = document.getElementById('questTitle')?.value;
    const description = document.getElementById('questDescription')?.value;
    const deadline = document.getElementById('questDeadline')?.value;
    const type = document.getElementById('questType')?.value;
    
    if (title && description && deadline) {
        const newQuest = {
            id: Date.now(),
            title,
            description,
            deadline,
            type,
            status: 'active', // active, overdue, or completed
            dateAdded: new Date().toISOString()
        };
        
        quests.push(newQuest);
        localStorage.setItem('quests', JSON.stringify(quests));
        
        closeAddQuestModal();
        loadQuests();
        
        // Clear form
        if (document.getElementById('questTitle')) {
            document.getElementById('questTitle').value = '';
        }
        if (document.getElementById('questDescription')) {
            document.getElementById('questDescription').value = '';
        }
        if (document.getElementById('questDeadline')) {
            document.getElementById('questDeadline').value = '';
        }
    }
}

function completeQuest(id) {
    const quest = quests.find(q => q.id === id);
    if (quest) {
        quest.status = 'completed';
        quest.dateCompleted = new Date().toISOString();
        localStorage.setItem('quests', JSON.stringify(quests));
        loadQuests();
    }
}

// Function to delete a quest by ID
function deleteQuest(id) {
    // Filter out the quest with the given ID
    quests = quests.filter(quest => quest.id !== id);
    // Update localStorage with the new quests array
    localStorage.setItem('quests', JSON.stringify(quests));
    // Reload the quests to update the UI
    loadQuests();
}

function checkOverdueQuests() {
    const now = new Date();
    quests.forEach(quest => {
        if (quest.status === 'active' && new Date(quest.deadline) < now) {
            quest.status = 'overdue';
        }
    });
    localStorage.setItem('quests', JSON.stringify(quests));
    loadQuests();

    // Check every minute
    setTimeout(checkOverdueQuests, 60000);
}

function formatDeadline(deadline) {
    const date = new Date(deadline);
    return date.toLocaleString();
}

function loadQuests() {
    const activeQuests = document.getElementById('activeQuests');
    const overdueQuests = document.getElementById('overdueQuests');
    const completedQuests = document.getElementById('completedQuests');
    
    if (activeQuests && overdueQuests && completedQuests) {
        // Clear existing quests
        activeQuests.innerHTML = '';
        overdueQuests.innerHTML = '';
        completedQuests.innerHTML = '';
        
        // Sort quests by deadline
        quests.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        
        quests.forEach(quest => {
            const questElement = document.createElement('div');
            questElement.className = `quest-item ${quest.status}`;
            questElement.innerHTML = `
    <div class="quest-info">
        <div class="quest-title">${quest.title}</div>
        <div class="quest-description">${quest.description}</div>
        <div class="quest-deadline">Deadline: ${formatDeadline(quest.deadline)}</div>
        <div class="quest-type">${quest.type}</div>
    </div>
    <div class="quest-actions">
        ${quest.status !== 'completed' ? `
            <button class="quest-button complete-quest-btn" data-quest-id="${quest.id}">Complete</button>
        ` : `
            <button class="quest-button delete-quest-btn" data-quest-id="${quest.id}">Delete</button>
        `}
    </div>
`;

            
            switch(quest.status) {
                case 'active':
                    activeQuests.appendChild(questElement);
                    break;
                case 'overdue':
                    overdueQuests.appendChild(questElement);
                    break;
                case 'completed':
                    completedQuests.appendChild(questElement);
                    break;
            }

            // Add event listener for complete button
            const completeBtn = questElement.querySelector('.complete-quest-btn');
            const deleteBtn = questElement.querySelector('.delete-quest-btn');

            if (completeBtn) {
                completeBtn.addEventListener('click', () => {
                    completeQuest(parseInt(completeBtn.getAttribute('data-quest-id')));
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    deleteQuest(parseInt(deleteBtn.getAttribute('data-quest-id')));
                });
            }
        });
    }
}

