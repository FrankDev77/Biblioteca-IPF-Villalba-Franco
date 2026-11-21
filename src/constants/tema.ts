export const colores = {
  claro: {
    fondo: '#F8FAFC',
    superficie: '#FFFFFF',
    texto: '#0F172A',
    textoSuave: '#475569',
    borde: '#E2E8F0',
    primario: '#2563EB',
    primarioSuave: '#DBEAFE',
    exito: '#16A34A',
    alerta: '#EA580C',
    error: '#DC2626',
    silueta: '#E2E8F0',
    textoSobrePrimario: '#FFFFFF',
    textoSobreExito: '#FFFFFF',
    textoSobreError: '#FFFFFF',
    velo: '#0F172A',
    textoSobreVelo: '#FFFFFF',
  },
  oscuro: {
    fondo: '#0B1220',
    superficie: '#111827',
    texto: '#F1F5F9',
    textoSuave: '#94A3B8',
    borde: '#1F2937',
    primario: '#60A5FA',
    primarioSuave: '#1E3A8A',
    exito: '#4ADE80',
    alerta: '#FB923C',
    error: '#F87171',
    silueta: '#1F2937',
    // los primarios del modo oscuro son claros, el texto encima va oscuro para que contraste
    textoSobrePrimario: '#0B1220',
    textoSobreExito: '#0B1220',
    textoSobreError: '#0B1220',
    velo: '#000000',
    textoSobreVelo: '#FFFFFF',
  },
};

export const espaciado = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
};

export const radios = {
  s: 6,
  m: 10,
  l: 16,
  xl: 24,
  pill: 999,
};

export const tipografia = {
  titulo: { fontSize: 24, fontWeight: '700' as const },
  subtitulo: { fontSize: 18, fontWeight: '600' as const },
  cuerpo: { fontSize: 15, fontWeight: '400' as const },
  pie: { fontSize: 13, fontWeight: '400' as const },
};

export const sombras = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
};

export const timings = {
  rapido: 150,
  medio: 220,
  lento: 320,
};

export type Paleta = typeof colores.claro;