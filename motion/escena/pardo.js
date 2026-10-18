// PARDO: EL MISMO DIBUJO DE LA LANDING (src/app/compartido/pardo/pardo.ts), SEPARADO EN PARTES PARA ANIMARLAS:
// COLA, CUERPO, BRAZOS DE CADA ESTADO, CABEZA (OREJAS, OJOS Y BOCAS) Y LO QUE VA DELANTE (MANO EN LA BARBILLA, LIBRO, ESTRELLAS).
// LOS 5 ESTADOS (saluda, celebra, anima, piensa, lee) ESTAN TODOS DIBUJADOS; LA POSE SE ELIGE MOSTRANDO SUS GRUPOS.
(function () {
  const brazoAbajoIzq = `
    <path d="M70 142 Q58 158 64 174" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
    <path d="M70 142 Q58 158 64 174" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
    <circle cx="64" cy="175" r="9.5" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <path d="M60 179.5 v3 M64 180.5 v3 M68 179.5 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>`;
  const manoArriba = (lado) => lado === 'der' ? `
    <path d="M130 142 Q158 134 166 108" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
    <path d="M130 142 Q158 134 166 108" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
    <circle cx="167" cy="102" r="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <path d="M163 108 v3 M167 109 v3 M171 108 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>` : `
    <path d="M70 142 Q42 134 34 108" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
    <path d="M70 142 Q42 134 34 108" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
    <circle cx="33" cy="102" r="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <path d="M29 108 v3 M33 109 v3 M37 108 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>`;
  const estrella = (cx, cy, r) => {
    const p = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1)); }
    return `<polygon class="p-brillo" points="${p.join(' ')}" fill="#FFC531" stroke="#C98A00" stroke-width="2" stroke-linejoin="round"/>`;
  };
  const ojos = (y, bx, by, cx2, cy2) => `
    <ellipse cx="78" cy="${y}" rx="10.5" ry="12.5" fill="#2A2233"/>
    <ellipse cx="122" cy="${y}" rx="10.5" ry="12.5" fill="#2A2233"/>
    <circle cx="${bx}" cy="${by}" r="4.2" fill="#fff"/>
    <circle cx="${bx + 44}" cy="${by}" r="4.2" fill="#fff"/>
    <circle cx="${cx2}" cy="${cy2}" r="1.9" fill="#fff"/>
    <circle cx="${cx2 + 44}" cy="${cy2}" r="1.9" fill="#fff"/>`;

  window.svgPardo = () => `
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
  <g id="p-cola">
    <path d="M136 190 C 166 194, 182 170, 170 146" fill="none" stroke="#7A4B12" stroke-width="15" stroke-linecap="round"/>
    <path d="M136 190 C 166 194, 182 170, 170 146" fill="none" stroke="#F7B733" stroke-width="9.5" stroke-linecap="round"/>
    <circle cx="170" cy="147" r="5" fill="#9A5B16"/>
  </g>
  <g id="p-cuerpo">
    <rect x="50" y="132" width="100" height="62" rx="20" fill="#2F7FE0" stroke="#1D4F94" stroke-width="3"/>
    <ellipse cx="80" cy="203" rx="17" ry="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <ellipse cx="120" cy="203" rx="17" ry="11" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <path d="M76 207 v-4 M84 207 v-4 M116 207 v-4 M124 207 v-4" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
    <ellipse cx="100" cy="166" rx="40" ry="39" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <ellipse cx="100" cy="174" rx="23" ry="25" fill="#FFF2D6"/>
    <circle cx="70" cy="158" r="5" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="8.0 3.8"/>
    <circle cx="130" cy="158" r="5" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="8.0 3.8"/>
    <circle cx="74" cy="184" r="4" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="6.4 3.0"/>
    <circle cx="126" cy="184" r="4" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="6.4 3.0"/>
    <path d="M77 136 C 73 152, 72 168, 75 186" fill="none" stroke="#1D4F94" stroke-width="9" stroke-linecap="round"/>
    <path d="M77 136 C 73 152, 72 168, 75 186" fill="none" stroke="#2F7FE0" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M123 136 C 127 152, 128 168, 125 186" fill="none" stroke="#1D4F94" stroke-width="9" stroke-linecap="round"/>
    <path d="M123 136 C 127 152, 128 168, 125 186" fill="none" stroke="#2F7FE0" stroke-width="5.5" stroke-linecap="round"/>
    <rect x="69" y="160" width="9" height="7" rx="2" fill="#FFC531" stroke="#C98A00" stroke-width="1.5"/>
    <rect x="122" y="160" width="9" height="7" rx="2" fill="#FFC531" stroke="#C98A00" stroke-width="1.5"/>
  </g>
  <!-- BRAZOS DETRAS DE LA CABEZA -->
  <g id="p-atras-saluda" class="p-pose">${brazoAbajoIzq}<g id="p-mano">${manoArriba('der')}</g></g>
  <g id="p-atras-celebra" class="p-pose"><g id="p-brazos">${manoArriba('izq')}${manoArriba('der')}</g></g>
  <g id="p-atras-anima" class="p-pose">${brazoAbajoIzq}
    <g id="p-puno">
      <path d="M130 142 Q162 150 158 124" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
      <path d="M130 142 Q162 150 158 124" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
      <circle cx="158" cy="118" r="12" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
      <path d="M151 114 h10 M151 119 h10" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
    </g>
    <path d="M176 104 l8 -5 M179 118 h9 M174 131 l8 4" stroke="#FF6F59" stroke-width="3" stroke-linecap="round"/>
  </g>
  <g id="p-atras-piensa" class="p-pose">${brazoAbajoIzq}</g>
  <!-- CABEZA -->
  <g id="p-cabeza">
    <g id="p-oreja-izq"><circle cx="60" cy="46" r="17" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/><circle cx="61" cy="48" r="8.5" fill="#FFB49C"/></g>
    <g id="p-oreja-der"><circle cx="140" cy="46" r="17" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/><circle cx="139" cy="48" r="8.5" fill="#FFB49C"/></g>
    <ellipse cx="100" cy="86" rx="55" ry="49" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <circle cx="91" cy="50" r="3.6" fill="#9A5B16"/><circle cx="100" cy="45" r="4" fill="#9A5B16"/><circle cx="109" cy="50" r="3.6" fill="#9A5B16"/>
    <circle cx="59" cy="84" r="4.5" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="7.2 3.4"/>
    <circle cx="141" cy="84" r="4.5" fill="#E39A2A" stroke="#9A5B16" stroke-width="2.4" stroke-dasharray="7.2 3.4"/>
    <circle cx="64" cy="66" r="2.6" fill="#9A5B16"/><circle cx="136" cy="66" r="2.6" fill="#9A5B16"/>
    <circle cx="57" cy="100" r="2" fill="#9A5B16"/><circle cx="143" cy="100" r="2" fill="#9A5B16"/>
    <ellipse cx="100" cy="110" rx="25" ry="17" fill="#FFF2D6"/>
    <g id="p-mirada">
      <g id="p-ojos-normal" class="p-pose p-ojos">${ojos(85, 74.5, 81, 81.5, 90)}</g>
      <g id="p-ojos-piensa" class="p-pose"><g class="p-ojos">${ojos(83, 77, 77.5, 82.75, 88)}</g><path d="M112 66 Q122 60 132 65" fill="none" stroke="#7A4B12" stroke-width="2.6" stroke-linecap="round"/></g>
      <g id="p-ojos-lee" class="p-pose p-ojos">${ojos(88, 74.5, 90, 81.5, 93)}</g>
    </g>
    <ellipse cx="64" cy="106" rx="8.5" ry="5.5" fill="#FF8E7A" opacity=".5"/>
    <ellipse cx="136" cy="106" rx="8.5" ry="5.5" fill="#FF8E7A" opacity=".5"/>
    <path d="M92.5 101 Q100 97 107.5 101 Q105 107 100 108.5 Q95 107 92.5 101 Z" fill="#5A3325"/>
    <ellipse cx="97.5" cy="101.5" rx="2.2" ry="1.2" fill="#fff" opacity=".55"/>
    <g id="p-boca-sonrisa" class="p-boca"><path d="M100 108.5 v3.5 M89 112 Q94.5 119 100 112 Q105.5 119 111 112" fill="none" stroke="#5A3325" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g id="p-boca-abierta" class="p-boca">
      <path d="M100 108.5 v3" stroke="#5A3325" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M89 112 Q100 112 111 112 Q109 126 100 126 Q91 126 89 112 Z" fill="#8E2F3A" stroke="#5A3325" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M93.5 121 Q100 116 106.5 121 Q104 125.5 100 125.5 Q96 125.5 93.5 121 Z" fill="#FF8E9A"/>
    </g>
    <g id="p-boca-media" class="p-boca">
      <path d="M100 108.5 v3" stroke="#5A3325" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M91 112 Q100 112 109 112 Q107 119.5 100 119.5 Q93 119.5 91 112 Z" fill="#8E2F3A" stroke="#5A3325" stroke-width="2.2" stroke-linejoin="round"/>
    </g>
    <g id="p-boca-piensa" class="p-boca"><path d="M100 108.5 v3.5" stroke="#5A3325" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="103" cy="117" rx="3.6" ry="3" fill="#8E2F3A" stroke="#5A3325" stroke-width="2"/></g>
  </g>
  <!-- LO QUE VA DELANTE -->
  <g id="p-frente-piensa" class="p-pose">
    <path d="M130 144 Q144 136 128 131" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
    <path d="M130 144 Q144 136 128 131" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
    <circle cx="126" cy="131" r="10" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <path d="M122 136 v3 M126 137 v3 M130 136 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
    <g id="p-pregunta">
      <circle cx="150" cy="58" r="3.5" fill="#fff" stroke="#8B6CEF" stroke-width="2.5"/>
      <circle cx="160" cy="44" r="5" fill="#fff" stroke="#8B6CEF" stroke-width="2.5"/>
      <circle cx="178" cy="22" r="16" fill="#fff" stroke="#8B6CEF" stroke-width="3"/>
      <path d="M172.5 17 Q172.5 11 178 11 Q184 11 184 16.5 Q184 20.5 178.5 22.5 V25.5" fill="none" stroke="#8B6CEF" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="178.5" cy="31" r="2.1" fill="#8B6CEF"/>
    </g>
  </g>
  <g id="p-frente-lee" class="p-pose">
    <path d="M70 142 Q60 158 70 172" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
    <path d="M70 142 Q60 158 70 172" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
    <path d="M130 142 Q140 158 130 172" fill="none" stroke="#7A4B12" stroke-width="21" stroke-linecap="round"/>
    <path d="M130 142 Q140 158 130 172" fill="none" stroke="#F7B733" stroke-width="15" stroke-linecap="round"/>
    <path d="M100 160 Q80 151 58 155 L58 190 Q80 186 100 194 Q120 186 142 190 L142 155 Q120 151 100 160 Z" fill="#2F7FE0" stroke="#1D4F94" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 158 Q82 150 63 153 L63 185 Q82 181 100 189 Z" fill="#fff" stroke="#1D4F94" stroke-width="2" stroke-linejoin="round"/>
    <path d="M100 158 Q118 150 137 153 L137 185 Q118 181 100 189 Z" fill="#fff" stroke="#1D4F94" stroke-width="2" stroke-linejoin="round"/>
    <path d="M70 162 q13 -2 24 3 M70 170 q13 -2 24 3 M106 165 q11 -5 24 -3 M106 173 q11 -5 24 -3" fill="none" stroke="#9BBDEB" stroke-width="2" stroke-linecap="round"/>
    <circle cx="63" cy="172" r="9.5" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <path d="M59 176.5 v3 M63 177.5 v3 M67 176.5 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="137" cy="172" r="9.5" fill="#F7B733" stroke="#7A4B12" stroke-width="3"/>
    <path d="M133 176.5 v3 M137 177.5 v3 M141 176.5 v3" stroke="#7A4B12" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  <g id="p-frente-celebra" class="p-pose">
    ${estrella(18, 66, 10)}${estrella(182, 66, 10)}${estrella(40, 24, 7.5)}${estrella(160, 20, 8)}
    <circle class="p-brillo" cx="14" cy="36" r="3" fill="#FF6F59"/><circle class="p-brillo" cx="188" cy="40" r="3" fill="#2FAE6B"/>
    <circle class="p-brillo" cx="100" cy="12" r="3" fill="#8B6CEF"/><circle class="p-brillo" cx="184" cy="96" r="2.6" fill="#2F7FE0"/>
  </g>
</svg>`;

  // GRUPOS VISIBLES EN CADA ESTADO (LA BOCA SE MANEJA APARTE PORQUE CAMBIA AL HABLAR)
  window.POSES = {
    saluda: { grupos: ['p-atras-saluda', 'p-ojos-normal'], boca: 'sonrisa' },
    celebra: { grupos: ['p-atras-celebra', 'p-ojos-normal', 'p-frente-celebra'], boca: 'abierta' },
    anima: { grupos: ['p-atras-anima', 'p-ojos-normal'], boca: 'abierta' },
    piensa: { grupos: ['p-atras-piensa', 'p-ojos-piensa', 'p-frente-piensa'], boca: 'piensa' },
    lee: { grupos: ['p-ojos-lee', 'p-frente-lee'], boca: 'sonrisa' },
  };
})();
