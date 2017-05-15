import React from 'react';

const About = () => {
  return (
    <div className="row">

      <div className="row" style={{padding: 20}}>
        <div className="col-xs-12 center-xs" style={{marginBottom: 20}}>
          <img src="../../img/jcd.png" alt=""/>
        </div>
        <div className="col-xs-12 tituloAbout">
          InvasiOnline
        </div>
        <div className="col-xs-12 textAbout">
          Mussum Ipsum, cacilds vidis litro abertis.
          A ordem dos tratores não altera o pão duris
          Atirei o pau no gatis, per gatis num morreus.
          Praesent malesuada urna nisi, quis volutpat erat
          hendrerit non. Nam vulputate dapibus. Nec orci
          ornare consequat. Praesent lacinia ultrices
          consectetur. Sed non ipsum felis.
        </div>

        <div className="col-xs-12 tituloAbout">Equipe</div>
        <div className="col-xs-12 textAbout">
          Mussum - User interface
          <br />
          Zacarias - Front End
          <br />
          Tião - Programador
          <br />
          Didi - Ilustrador
          <br />
          Dedé - Coordenador UI/UX
          <br />
          Sargento Pincel - Diretor conteúdos digitais
        </div>
      </div>
    </div>
  )
}

export default About;
