import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const banner = useRef();

  useEffect(() => {
    // Evita que o React duplique o anúncio ao recarregar a tela
    if (!banner.current || banner.current.hasChildNodes()) return;

    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    // ATENÇÃO: Substitua a 'key' abaixo pela key que a Adsterra te deu
    conf.innerHTML = `
      atOptions = {
        'key' : 'ab2562001c353492d452f42882ac6043', 
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    // ATENÇÃO: Substitua o link abaixo pelo link do 'src' que a Adsterra te deu
    script.src = "//www.highperformanceformat.com/ab2562001c353492d452f42882ac6043/invoke.js"; 
    
    banner.current.append(conf);
    banner.current.append(script);
  }, []);

  return <div ref={banner} style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }} />;
}