export function storageSyncMetaReducer(reducer: any) {

    let isInitialized = false;

    return (state: any, action: any) => {

      if (typeof localStorage === 'undefined') {
        return reducer(state, action);
      }

      // Handle logout - clear localStorage and reset state
      if (action.type === '[Auth] Logout') {
        localStorage.removeItem('appState');
        return reducer(undefined, action); // Reset state
      }

      // Handle order clear - clear localStorage to prevent cart restoration
      if (action.type === '[Order] Clear Order') {
        console.log('🗑️ Storage sync: Clearing localStorage due to order clear');
        localStorage.removeItem('appState');
        // Continue processing the action normally
      }

      // CRITICAL: Clear localStorage when payment succeeds to prevent saving cart with order
      if (action.type === '[Order] Order Payment Success') {
        console.log('💳 Storage sync: Payment success detected, preparing to clear cart');
        // Don't clear yet, but flag that we should skip saves
      }

      if (!isInitialized) {
        const savedState = localStorage.getItem('appState');
        if (savedState) {
          state = { ...JSON.parse(savedState), ...state };
        }
        isInitialized = true;
      }

      const nextState = reducer(state, action);

      // Don't save to localStorage after payment success or clear actions
      if (action.type === '[Cart] Clear Cart' ||
          action.type === '[Order] Clear Order' ||
          action.type === '[Order] Order Payment Success') {
        console.log('🚫 Storage sync: Skipping localStorage save for:', action.type);
        return nextState;
      }

      if (action.type !== '@ngrx/store/init' && action.type !== '@ngrx/store/update-reducers') {
        localStorage.setItem('appState', JSON.stringify(nextState));
      }


      return nextState;
    };
  }
  