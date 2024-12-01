export function storageSyncMetaReducer(reducer: any) {
    
    let isInitialized = false;

    return (state: any, action: any) => {

      if (typeof localStorage === 'undefined') {
        return reducer(state, action);
      }  

      if (action.type === '[Auth] Logout') {
        localStorage.removeItem('appState');
        return reducer(undefined, action); // Reset state
      }  

      if (!isInitialized) {
        const savedState = localStorage.getItem('appState');
        if (savedState) {
          state = { ...JSON.parse(savedState), ...state };
        }
        isInitialized = true;
      }
  
      const nextState = reducer(state, action);
  
      if (action.type !== '@ngrx/store/init' && action.type !== '@ngrx/store/update-reducers') {
        localStorage.setItem('appState', JSON.stringify(nextState));
      }
  
      
      return nextState;
    };
  }
  