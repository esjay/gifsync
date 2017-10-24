let searchParams = new URLSearchParams(window.location.search),
    param = searchParams.get.bind(searchParams);

export default param;
