import { QUEST_TYPES, QUEST_STATUS, DIFFICULTY, quests, playerData } from './questData.js';

class QuestSystem {
    constructor() {
        this.quests = quests;
        this.playerData = playerData;
        this.initializeUI();
        this.loadSavedData();
    }

    initializeUI() {
        this.questList = document.getElementById('quest-list');
        this.setupEventListeners();
        this.renderQuests();
    }

    loadSavedData() {
        const savedData = localStorage.getItem('questData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.playerData = { ...this.playerData, ...data };
        }
    }

    saveData() {
        localStorage.setItem('questData', JSON.stringify(this.playerData));
    }

    setupEventListeners() {
        document.addEventListener('questComplete', (e) => {
            this.completeQuest(e.detail.questId);
        });

        document.addEventListener('questAccept', (e) => {
            this.acceptQuest(e.detail.questId);
        });
    }

    renderQuests() {
        this.questList.innerHTML = '';
        
        this.quests.forEach(quest => {
            const questElement = this.createQuestElement(quest);
            this.questList.appendChild(questElement);
        });
    }

    createQuestElement(quest) {
        const questDiv = document.createElement('div');
        questDiv.className = `quest-item ${quest.status}`;
        questDiv.innerHTML = `
            <div class="quest-header">
                <img src="${quest.icon}" alt="${quest.title}" class="quest-icon">
                <h3>${quest.title}</h3>
            </div>
            <p>${quest.description}</p>
            <div class="quest-footer">
                <div class="quest-type">${quest.type}</div>
                <button class="quest-button" data-quest-id="${quest.id}">
                    ${this.getQuestButtonText(quest)}
                </button>
            </div>
        `;

        questDiv.querySelector('.quest-button').addEventListener('click', () => {
            this.handleQuestAction(quest);
        });

        return questDiv;
    }

    getQuestButtonText(quest) {
        switch(quest.status) {
            case QUEST_STATUS.AVAILABLE:
                return 'Accept Quest';
            case QUEST_STATUS.IN_PROGRESS:
                return 'View Progress';
            case QUEST_STATUS.COMPLETED:
                return 'Completed';
            case QUEST_STATUS.LOCKED:
                return 'Locked';
            default:
                return 'View Quest';
        }
    }

    handleQuestAction(quest) {
        switch(quest.status) {
            case QUEST_STATUS.AVAILABLE:
                this.acceptQuest(quest.id);
                break;
            case QUEST_STATUS.IN_PROGRESS:
                this.showQuestProgress(quest);
                break;
            case QUEST_STATUS.COMPLETED:
                this.showQuestSummary(quest);
                break;
        }
    }

    acceptQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && quest.status === QUEST_STATUS.AVAILABLE) {
            quest.status = QUEST_STATUS.IN_PROGRESS;
            this.playerData.activeQuests.push(questId);
            this.saveData();
            this.renderQuests();
            this.showNotification(`Quest accepted: ${quest.title}`);
        }
    }

    completeQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && quest.status === QUEST_STATUS.IN_PROGRESS) {
            quest.status = QUEST_STATUS.COMPLETED;
            this.playerData.completedQuests.push(questId);
            this.playerData.activeQuests = this.playerData.activeQuests.filter(id => id !== questId);
            this.awardQuestRewards(quest);
            this.saveData();
            this.renderQuests();
            this.showNotification(`Quest completed: ${quest.title}`, 'success');
        }
    }

    awardQuestRewards(quest) {
        // Add XP
        this.playerData.xp += quest.difficulty.xp;
        
        // Check for level up
        while (this.playerData.xp >= this.playerData.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.playerData.level++;
        this.playerData.xp -= this.playerData.xpToNextLevel;
        this.playerData.xpToNextLevel = Math.floor(this.playerData.xpToNextLevel * 1.5);
        this.showNotification(`Level Up! You are now level ${this.playerData.level}`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `quest-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showQuestProgress(quest) {
        // Implementation for showing quest progress modal
    }

    showQuestSummary(quest) {
        // Implementation for showing completed quest summary
    }
}

// Initialize quest system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.questSystem = new QuestSystem();
});