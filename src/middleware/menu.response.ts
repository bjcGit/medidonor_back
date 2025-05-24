export const MenuSiderbar = (rol) => {
  const menu = [];

  if (rol === 'ADMIN') {
    menu.push(
      {
        title: 'Inicio',
        subtitle: 'Estado de las numeraciones',
        url: '/dashboard'
      },
      {
        title: 'Numerar',
        subtitle: 'Numerar un contrato',
        url: 'numeracion'
      },
      {
        title: 'Listado',
        subtitle: 'Mis numeraciones',
        url: 'list-numeraciones'
      },
      {
        title: 'Reporte',
        subtitle: 'Exportar documento de excel',
        url: 'reportes'
      },
      {
        title: 'Novedades',
        subtitle: 'Gestión de novedades',
        url: 'novedades'
      },
      {
        title: 'Codes',
        subtitle: 'Agregar o modificar codes',
        url: 'codes-list'
      },
      {
        title: 'Siglas',
        subtitle: 'Agregar o modificar siglas',
        url: 'sigla'
      },
      {
        title: 'Usuarios',
        subtitle: 'Configuración de usuarios',
        url: 'usuarios'
      },
      // {
      //   title: 'Supervisores',
      //   subtitle: 'Configuración de supervisor',
      //   url: 'supervisores'
      // },
    );
  }
  if (rol === 'NUMERACION') {
    menu.push(
      {
        title: 'Inicio',
        subtitle: 'Estado de las numeraciones',
        url: '/dashboard'
      },
      {
        title: 'Numerar',
        subtitle: 'Numerar un contrato',
        url: 'numeracion'
      },
      {
        title: 'Listado',
        subtitle: 'Mis numeraciones',
        url: 'list-numeraciones'
      },
      {
        title: 'Reporte',
        subtitle: 'Exportar documento de excel',
        url: 'reportes'
      },
    );
  }
  if (rol === 'DGA') {
    menu.push(
      {
        url: 'list-numeraciones',
        title: 'Numeraciones',
        subtitle: 'Lista las numeraciones'
      },
      {
        url: 'cui',
        title: 'Gestión',
        subtitle: 'Gestiona las numeraciones'
      },
      {
        url: 'novedades',
        title: 'Novedades',
        subtitle: 'Novedades gestionadas'
      },
    );
  }
  if (rol === 'SUPERVISOR') {
    menu.push(
      {
        url: 'list-numeraciones',
        title: 'Numeraciones',
        subtitle: 'Lista las numeraciones'
      },
      {
        url: 'novedades',
        title: 'Novedades',
        subtitle: 'Gestionar novedades'
      },
      {
        url: 'list-novedades',
        title: 'Listado de novedades',
        subtitle: 'Novedades gestionadas'
      },
  
    );
  }
  if (rol === 'UGA') {
    menu.push(
      {
        title: 'Numerar',
        subtitle: 'Numerar un contrato',
        url: 'numeracion'
      },
      {
        url: 'list-numeraciones',
        title: 'Numeraciones',
        subtitle: 'Lista las numeraciones'
      },
      {
        url: 'novedades',
        title: 'Novedades',
        subtitle: 'Gestionar novedades'
      },
      {
        url: 'list-novedades',
        title: 'Listado de novedades',
        subtitle: 'Novedades gestionadas'
      },
  
    );
  }

  return menu;
};
