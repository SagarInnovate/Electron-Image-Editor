/**
 * History Manager Service
 * 
 * Manages undo/redo functionality:
 * - Tracks image state history
 * - Implements undo/redo operations
 * - Optimizes memory usage for history
 */

import { DEFAULT_HISTORY_LIMIT } from '../utils/constants';

class HistoryManager {
  constructor(options = {}) {
    this.states = [];
    this.currentIndex = -1;
    this.maxStates = options.maxStates || DEFAULT_HISTORY_LIMIT;
    this.onChange = options.onChange || (() => {});
  }
  
  // Add a new state to history
  addState(state) {
    // Don't add if it's the same as the current state
    if (this.currentIndex >= 0 && this.areStatesEqual(state, this.states[this.currentIndex])) {
      return;
    }
    
    // If we're not at the end of the history, remove all states after the current index
    if (this.currentIndex < this.states.length - 1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }
    
    // Add the new state
    this.states.push(this.cloneState(state));
    
    // If we've exceeded the max number of states, remove the oldest one
    if (this.states.length > this.maxStates) {
      this.states.shift();
    } else {
      // Otherwise, increment the current index
      this.currentIndex++;
    }
    
    // Notify of change
    this.notifyChange();
  }
  
  // Undo to the previous state
  undo() {
    if (this.canUndo()) {
      this.currentIndex--;
      this.notifyChange();
      return this.cloneState(this.getCurrentState());
    }
    return null;
  }
  
  // Redo to the next state
  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      this.notifyChange();
      return this.cloneState(this.getCurrentState());
    }
    return null;
  }
  
  // Check if undo is available
  canUndo() {
    return this.currentIndex > 0;
  }
  
  // Check if redo is available
  canRedo() {
    return this.currentIndex < this.states.length - 1;
  }
  
  // Get the current state
  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.states.length) {
      return this.states[this.currentIndex];
    }
    return null;
  }
  
  // Get all states (for debugging)
  getAllStates() {
    return this.states.map(state => this.cloneState(state));
  }
  
  // Clear history
  clear() {
    this.states = [];
    this.currentIndex = -1;
    this.notifyChange();
  }
  
  // Get history stats
  getStats() {
    return {
      totalStates: this.states.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }
  
  // Set a new callback function for changes
  setOnChange(callback) {
    this.onChange = callback || (() => {});
  }
  
  // Private method to notify of changes
  notifyChange() {
    if (typeof this.onChange === 'function') {
      this.onChange({
        canUndo: this.canUndo(),
        canRedo: this.canRedo(),
        currentIndex: this.currentIndex,
        totalStates: this.states.length,
      });
    }
  }
  
  // Private method to clone a state (deep copy)
  cloneState(state) {
    if (!state) return null;
    
    // For image data, we don't want to deep clone the data URL, which can be very large
    // Instead, we'll store a reference to it
    if (state.imageData && typeof state.imageData === 'string' && state.imageData.startsWith('data:')) {
      const { imageData, ...rest } = state;
      return {
        ...JSON.parse(JSON.stringify(rest)),
        imageData,
      };
    }
    
    return JSON.parse(JSON.stringify(state));
  }
  
  // Private method to compare two states
  areStatesEqual(state1, state2) {
    if (!state1 || !state2) return false;
    
    // If both states have imageData, compare them
    if (state1.imageData && state2.imageData) {
      // If they're both strings and they're equal, return true
      if (typeof state1.imageData === 'string' && typeof state2.imageData === 'string') {
        if (state1.imageData === state2.imageData) {
          return true;
        }
      }
    }
    
    // Compare other properties except imageData
    const { imageData: img1, ...rest1 } = state1;
    const { imageData: img2, ...rest2 } = state2;
    
    return JSON.stringify(rest1) === JSON.stringify(rest2);
  }
}

// Create a singleton instance
const historyManager = new HistoryManager();

export default historyManager;

// Additional exports for direct usage
export const addHistoryState = (state) => historyManager.addState(state);
export const undoHistory = () => historyManager.undo();
export const redoHistory = () => historyManager.redo();
export const canUndo = () => historyManager.canUndo();
export const canRedo = () => historyManager.canRedo();
export const getCurrentState = () => historyManager.getCurrentState();
export const clearHistory = () => historyManager.clear();
export const getHistoryStats = () => historyManager.getStats();
export const setHistoryChangeCallback = (callback) => historyManager.setOnChange(callback);

// Create a new history manager for a specific session/image
export const createHistoryManager = (options) => new HistoryManager(options);