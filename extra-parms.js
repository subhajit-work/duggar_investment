 /* // -- url send extra query params start -----
  this.router.navigate(
    [], 
    {
      relativeTo: this.activatedRoute,
      queryParams: { myParam: 'myNewValue', uuumyParam: 'uuuumyNewValue' },
      queryParamsHandling: 'merge'
  });

  //--- get  query params from url ---
  const parm_url = window.location.href;
  console.log(' query params from url 111 >>>>',  parm_url.split('?')[1]);
  //--- get  query params from url end----

  // url send extra query params end */