import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 64;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE,
  paddingBottom: theme.spacing(10),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP
  }
}));

// ----------------------------------------------------------------------

DashboardLayout.propTypes = {
  children: PropTypes.node
};

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />
      <MainStyle>{children}</MainStyle>
    </RootStyle>
  );
}
