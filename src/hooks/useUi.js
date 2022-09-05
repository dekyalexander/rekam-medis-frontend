import { useDispatch, useSelector } from 'react-redux';
// redux
import { setActiveMenu, setApplicationMenus, setMenuActions } from '../redux/slices/ui';

// ----------------------------------------------------------------------

export default function useUi() {
  const dispatch = useDispatch();
  const { isLoading, activeMenu, applicationMenus, menuActions} = useSelector(
    (state) => state.ui
  );

  return {
    isLoading,
    activeMenu, 
    menuActions,

    setActiveMenu: (menu) =>
      dispatch(setActiveMenu(menu)),

    setApplicationMenus: (applicationMenus)=>
      dispatch(setApplicationMenus(applicationMenus)),

    setMenuActions: (menuActions)=>
      dispatch(setMenuActions(menuActions))
  };
}
