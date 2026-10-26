import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank layout

    # Colores corporativos Farmacias Peruanas (InkaFarma / Mifarma)
    COLOR_PRIMARY = RGBColor(0, 43, 102)     # InkaFarma Azul Marino Profundo #002B66
    COLOR_ACCENT = RGBColor(255, 209, 0)     # InkaFarma Amarillo Oro #FFD100
    COLOR_MIFARMA = RGBColor(211, 47, 47)    # Mifarma Rojo #D32F2F
    COLOR_SLATE_DARK = RGBColor(15, 23, 42)  # Slate 900
    COLOR_SLATE_MUTED = RGBColor(100, 116, 139) # Slate 500
    COLOR_LIGHT_BG = RGBColor(248, 250, 252) # Slate 50
    COLOR_EMERALD = RGBColor(16, 185, 129)   # Emerald 500
    COLOR_CARD_BORDER = RGBColor(226, 232, 240) # Slate 200

    screenshots_dir = r"C:\Users\Ronny Mendoza\.gemini\antigravity\brain\0d8a0e1e-14ef-4338-b8be-33749b4f2178\screenshots"
    out_pptx = r"C:\Users\Ronny Mendoza\.gemini\antigravity\brain\0d8a0e1e-14ef-4338-b8be-33749b4f2178\PRUEBAS_SISTEMA_SIIP_FARMACIAS.pptx"

    # =========================================================================
    # SLIDE 1: PORTADA EJECUTIVA Y ACADÉMICA
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)

    # Fondo decorativo
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_PRIMARY
    bg1.line.fill.background()

    # Barra decorativa de acento dorado
    bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.2), Inches(13.333), Inches(0.3))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = COLOR_ACCENT
    bar1.line.fill.background()

    # Contenedor de texto de portada
    tx1 = s1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(11.0), Inches(5.0))
    tf1 = tx1.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "UNIVERSIDAD TECNOLÓGICA DEL PERÚ (UTP) • PROYECTO INTEGRADOR 2026"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_ACCENT

    p1 = tf1.add_paragraph()
    p1.text = "EVIDENCIAS Y PRUEBAS DEL SISTEMA SIIP"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)
    p1.space_before = Pt(16)

    p2 = tf1.add_paragraph()
    p2.text = "Sistema Inteligente de Inventario y Predicción de Demanda Farmacéutica"
    p2.font.size = Pt(20)
    p2.font.color.rgb = RGBColor(224, 231, 255)
    p2.space_before = Pt(8)

    p3 = tf1.add_paragraph()
    p3.text = "Demostración Funcional de Pantallas Críticas y Casos de Uso (CU01 - CU05)"
    p3.font.size = Pt(15)
    p3.font.italic = True
    p3.font.color.rgb = RGBColor(148, 163, 184)
    p3.space_before = Pt(6)

    p4 = tf1.add_paragraph()
    p4.text = (
        "\n• Estudiante: Ronny Fernando Mendoza Paucar (Cód. U25302314)\n"
        "• Asesora: Mg. Irani Guillen Gomez\n"
        "• Red Cobertura: 15 Sedes a Nivel Nacional (InkaFarma, Mifarma, CD Huachipa)\n"
        "• Cumplimiento Normativo: DIGEMID (BPA R.M. 833-2015), SUNAT (GRE) y Ley 29733"
    )
    p4.font.size = Pt(13)
    p4.font.color.rgb = RGBColor(255, 255, 255)
    p4.space_before = Pt(20)

    # Helper para slides de contenido
    def add_content_slide(title, module_tag, description_points, screenshot_filename, badge_color=COLOR_PRIMARY):
        slide = prs.slides.add_slide(blank_layout)

        # Fondo general blanco
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = RGBColor(248, 250, 252)
        bg.line.fill.background()

        # Cabecera superior moderna
        header_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(1.1))
        header_bar.fill.solid()
        header_bar.fill.fore_color.rgb = COLOR_PRIMARY
        header_bar.line.fill.background()

        # Acento amarillo delgado
        accent_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(1.08), Inches(13.333), Inches(0.04))
        accent_line.fill.solid()
        accent_line.fill.fore_color.rgb = COLOR_ACCENT
        accent_line.line.fill.background()

        # Texto cabecera
        header_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.12), Inches(12.0), Inches(0.85))
        htf = header_box.text_frame
        htf.word_wrap = True

        hp0 = htf.paragraphs[0]
        hp0.text = f"{module_tag.upper()} • PRUEBA FUNCIONAL DEL SISTEMA"
        hp0.font.size = Pt(10)
        hp0.font.bold = True
        hp0.font.color.rgb = COLOR_ACCENT

        hp1 = htf.add_paragraph()
        hp1.text = title
        hp1.font.size = Pt(22)
        hp1.font.bold = True
        hp1.font.color.rgb = RGBColor(255, 255, 255)
        hp1.space_before = Pt(2)

        # Panel Izquierdo: Explicación de la prueba (Ancho 4.5 pulgadas)
        card_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.3), Inches(4.5), Inches(5.8))
        card_box.fill.solid()
        card_box.fill.fore_color.rgb = RGBColor(255, 255, 255)
        card_box.line.color.rgb = COLOR_CARD_BORDER
        card_box.line.width = Pt(1)

        tx_card = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(4.1), Inches(5.4))
        ctf = tx_card.text_frame
        ctf.word_wrap = True

        cp0 = ctf.paragraphs[0]
        cp0.text = "🎯 Objetivo de la Pantalla:"
        cp0.font.size = Pt(13)
        cp0.font.bold = True
        cp0.font.color.rgb = COLOR_PRIMARY

        for idx, (bullet_title, bullet_desc) in enumerate(description_points):
            bp = ctf.add_paragraph()
            bp.space_before = Pt(10)
            bp.text = f"✔ {bullet_title}: "
            bp.font.size = Pt(11)
            bp.font.bold = True
            bp.font.color.rgb = COLOR_SLATE_DARK

            run = bp.add_run()
            run.text = bullet_desc
            run.font.size = Pt(10.5)
            run.font.bold = False
            run.font.color.rgb = COLOR_SLATE_MUTED

        # Panel Derecho: Captura de pantalla real (Ancho 7.4 pulgadas x Alto 5.8 pulgadas)
        img_path = os.path.join(screenshots_dir, screenshot_filename)
        if os.path.exists(img_path):
            img_card = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.3), Inches(1.3), Inches(7.4), Inches(5.8))
            img_card.fill.solid()
            img_card.fill.fore_color.rgb = RGBColor(255, 255, 255)
            img_card.line.color.rgb = COLOR_CARD_BORDER
            img_card.line.width = Pt(1.5)

            slide.shapes.add_picture(
                img_path, 
                Inches(5.35), 
                Inches(1.35), 
                width=Inches(7.3), 
                height=Inches(5.7)
            )

        # Pie de página académico
        footer = slide.shapes.add_textbox(Inches(0.6), Inches(7.15), Inches(12.0), Inches(0.3))
        ftf = footer.text_frame
        fp = ftf.paragraphs[0]
        fp.text = "Sistema SIIP • UTP 2026 • Ronny Mendoza (U25302314) • Docente: Irani Guillen Gomez • Evidencias de Ejecución"
        fp.font.size = Pt(9)
        fp.font.color.rgb = COLOR_SLATE_MUTED

        return slide

    # =========================================================================
    # SLIDE 2: ARQUITECTURA Y LOGIN SEGURO
    # =========================================================================
    add_content_slide(
        title="Acceso Seguro con Perfiles Farmacéuticos (CU01)",
        module_tag="Módulo de Autenticación y Seguridad",
        description_points=[
            ("Control de Acceso Basado en Roles (RBAC)", "Perfiles diferenciados para Químico Farmacéutico (Ventanilla), Administrador de CD Huachipa y Supervisor Regional."),
            ("Cumplimiento Normativo Ley 29733", "Consentimiento explícito de tratamiento de datos personales y banner de cookies para auditoría regulatoria."),
            ("Mecanismos Anti-Fuerza Bruta", "Protección con Honeypot para neutralizar bots y Rate Limiting restrictivo ante intentos fallidos de autenticación."),
            ("Asignación Dinámica de Sede", "El operador inicia sesión contextualizado en su sucursal de origen autorizada (InkaFarma San Isidro Central).")
        ],
        screenshot_filename="01_login.png"
    )

    # =========================================================================
    # SLIDE 3: DASHBOARD PRINCIPAL Y KPIS
    # =========================================================================
    add_content_slide(
        title="Panel de Control Ejecutivo & Red Nacional de 15 Sedes",
        module_tag="Dashboard Operativo y Métricas",
        description_points=[
            ("Visibilidad en Tiempo Real", "Monitoreo del inventario valorizado total en soles (PEN) distribuido en toda la cadena farmacéutica."),
            ("Indicador de Quiebres Críticos", "Alerta temprana de ítems en stock cero o próximo a agotarse con semaforización de riesgo."),
            ("Trazabilidad de Traslados", "Contador de órdenes de transferencia pendientes, en tránsito y recepcionadas entre sucursales."),
            ("Conexión Cloudflare R2", "Verificación del repositorio cloud distribuido para almacenamiento seguro de guías y fichas técnicas.")
        ],
        screenshot_filename="02_dashboard.png"
    )

    # =========================================================================
    # SLIDE 4: INVENTARIO GEOCERCANO (15 SEDES EN PERÚ)
    # =========================================================================
    add_content_slide(
        title="Búsqueda Inteligente e Inventario Geocercano (CU02)",
        module_tag="Módulo de Inventario Geocercano",
        description_points=[
            ("Algoritmo de Distancia Haversine", "Calcula la distancia geodésica exacta en kilómetros entre la sede del paciente y las sedes donantes."),
            ("Red Nacional de 15 Sedes en Perú", "Cobertura completa en Lima Metropolitana, Arequipa, Cusco, Trujillo, Chiclayo y Huancayo."),
            ("Filtros Macrorregionales", "Segmentación rápida por Norte, Centro, Sur y Lima con buscador en tiempo real por distrito y marca."),
            ("Doble Acción Inmediata", "Botón directo 'Ruta & Mapa' para orientar al paciente y 'Solicitar Traslado' para compensación de stock.")
        ],
        screenshot_filename="03_inventario_geocercano.png"
    )

    # =========================================================================
    # SLIDE 5: SOLICITUD DE TRASLADO INTERACTIVA
    # =========================================================================
    add_content_slide(
        title="Prueba de Solicitud de Traslado Inter-Sedes con IA (CU03)",
        module_tag="Módulo de Compensación de Stock",
        description_points=[
            ("Recomendación de Lote por IA", "Cálculo algorítmico del lote sugerido que optimiza el stock receptor sin desabastecer la sede donante."),
            ("Simulación en Tiempo Real (Antes ➔ Después)", "Proyección visual del saldo restante en la sede origen y el nuevo stock proyectado en la sede destino."),
            ("Valoración Económica Automática", "Cálculo del costo total en soles (S/ PEN) del lote en tránsito para auditoría y control de mermas."),
            ("Priorización Operativa", "Opciones de despacho Normal (4h), Urgente (1-2h) o Crítico Express ante recetas de urgencia en ventanilla.")
        ],
        screenshot_filename="04_modal_solicitar_traslado.png"
    )

    # =========================================================================
    # SLIDE 6: MINIMAPA DE GEOLOCALIZACIÓN Y GUÍA AL PACIENTE
    # =========================================================================
    add_content_slide(
        title="Minimapa de Orientación y Guía WhatsApp para el Paciente",
        module_tag="Módulo de Experiencia del Paciente",
        description_points=[
            ("Geolocalización Dinámica OSM", "Minimapa interactivo OpenStreetMap centrado en las coordenadas geográficas de la sucursal más cercana."),
            ("Estimación de Tiempos de Traslado", "Cálculo del tiempo promedio en automóvil y a pie hacia la botica con stock disponible."),
            ("Generador de Mensaje WhatsApp", "Copia con un clic el itinerario formal con dirección, referencia, stock y enlace a Google Maps para enviar al paciente."),
            ("Fidelización y No Pérdida de Venta", "Garantiza que el paciente encuentre su medicina en la misma cadena en menos de 10 minutos.")
        ],
        screenshot_filename="05_modal_ruta_mapa.png"
    )

    # =========================================================================
    # SLIDE 7: GESTIÓN DE PRODUCTOS Y CATÁLOGO FARMACÉUTICO
    # =========================================================================
    add_content_slide(
        title="Gestión de Catálogo Farmacéutico & Ajustes de Stock",
        module_tag="Módulo de Gestión de Productos",
        description_points=[
            ("Catálogo Multicategoría", "Gestión de Antibióticos, Analgésicos, Antiinflamatorios y Oncológicos con imágenes y código EAN/Barras."),
            ("Clasificación Marca vs Genérico", "Segmentación clara para cumplir con la política nacional de disponibilidad de medicamentos genéricos."),
            ("Ajuste de Inventario Auditado", "Permite registrar ingresos, regularizaciones por merma física y ajustes con motivo justificado."),
            ("Integración con Kardex FEFO", "Acceso directo a la hoja de vida, historial de movimientos y lotes de cada fármaco.")
        ],
        screenshot_filename="06_gestion_productos.png"
    )

    # =========================================================================
    # SLIDE 8: TRAZABILIDAD Y KARDEX FEFO (BPA DIGEMID)
    # =========================================================================
    add_content_slide(
        title="Trazabilidad por Lote y Kardex FEFO (BPA R.M. 833-2015)",
        module_tag="Auditoría y Buenas Prácticas de Almacenamiento",
        description_points=[
            ("Principio FEFO (First Expired, First Out)", "Garantiza la salida prioritaria de lotes con fecha de vencimiento más próxima para evitar caducidades."),
            ("Registro de Lote y Registro Sanitario", "Trazabilidad completa con código de lote del fabricante y fecha de expiración oficial."),
            ("Historial Cronológico de Movimientos", "Auditoría de Entradas, Salidas por Venta y Traslados entre sedes con usuario responsable."),
            ("Certificación DIGEMID", "Cumplimiento estricto de las Buenas Prácticas de Almacenamiento farmacéutico vigentes en el Perú.")
        ],
        screenshot_filename="07_modal_kardex_trazabilidad.png"
    )

    # =========================================================================
    # SLIDE 9: GESTIÓN DE SEDES NACIONALES (15 SUCURSALES)
    # =========================================================================
    add_content_slide(
        title="Administración Centralizada de 15 Sedes en el Perú",
        module_tag="Módulo de Gestión de Sedes",
        description_points=[
            ("Distribución Geográfica Nacional", "10 sedes en Lima Metropolitana y Callao, más 5 sedes estratégicas en Arequipa, Cusco, La Libertad, Lambayeque y Junín."),
            ("Ficha Técnica 360° por Sede", "Visualización de dirección exacta, teléfono, horario de atención, director técnico farmacéutico y tipo de sede."),
            ("Métricas Operativas en Tiempo Real", "Monitoreo del total de medicamentos en inventario, stock crítico y volumen de traslados recibidos/emitidos."),
            ("Filtros por Cadena y Región", "Clasificación instantánea entre InkaFarma, Mifarma y Centros de Distribución Mayoristas (CD Huachipa).")
        ],
        screenshot_filename="08_gestion_sedes.png"
    )

    # =========================================================================
    # SLIDE 10: ALERTAS PREDICTIVAS DE STOCK CON IA
    # =========================================================================
    add_content_slide(
        title="Motor de Alertas Predictivas de Demanda con Algoritmo IA (CU04)",
        module_tag="Módulo de Inteligencia Predictiva",
        description_points=[
            ("Cálculo de Consumo Diario Promedio", "Algoritmo estadístico que analiza el historial de dispensación para estimar la tasa diaria de salida de cajas."),
            ("Predicción de Quiebre a 7 Días", "Identifica fármacos que agotarán existencias en menos de 7 días antes de que ocurra la pérdida de stock en mostrador."),
            ("Autonomía Operativa en Días", "Calcula la cantidad de días de cobertura restante por sucursal bajo demanda regular."),
            ("Automatización de Solicitudes", "Generación preventiva de traslados inter-sedes con un clic desde el propio panel de alertas críticas.")
        ],
        screenshot_filename="09_alertas_predictivas.png"
    )

    # =========================================================================
    # SLIDE 11: GESTIÓN DE TRASLADOS Y DESPACHO GRE SUNAT
    # =========================================================================
    add_content_slide(
        title="Bandeja de Traslados y Guía de Remisión Electrónica SUNAT (CU05)",
        module_tag="Módulo de Logística y Cumplimiento Tributario",
        description_points=[
            ("Flujo de Estados Operativos", "Seguimiento riguroso de cada orden: PENDIENTE ➔ DESPACHADO ➔ EN TRÁNSITO ➔ COMPLETADO."),
            ("Emisión de Guía de Remisión (GRE)", "Cumplimiento tributario SUNAT con número de serie, RUC de transportista, placa y precinto de seguridad."),
            ("Código QR y Firma Digital", "Generación automática del código QR de validación fiscal y trazabilidad de custodia de medicamentos."),
            ("Recepción con Validación de Calidad", "Inspección de precintos íntegros y temperatura controlada al recepcionar la mercadería en la botica destino.")
        ],
        screenshot_filename="10_gestion_traslados.png"
    )

    # =========================================================================
    # SLIDE 12: RESUMEN DE CUMPLIMIENTO Y CONCLUSIONES
    # =========================================================================
    s_end = prs.slides.add_slide(blank_layout)

    bg_end = s_end.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg_end.fill.solid()
    bg_end.fill.fore_color.rgb = COLOR_PRIMARY
    bg_end.line.fill.background()

    bar_end = s_end.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.2), Inches(13.333), Inches(0.3))
    bar_end.fill.solid()
    bar_end.fill.fore_color.rgb = COLOR_ACCENT
    bar_end.line.fill.background()

    tx_end = s_end.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(6.0))
    etf = tx_end.text_frame
    etf.word_wrap = True

    ep0 = etf.paragraphs[0]
    ep0.text = "CONCLUSIONES Y VALIDACIÓN DEL SISTEMA SIIP"
    ep0.font.size = Pt(28)
    ep0.font.bold = True
    ep0.font.color.rgb = COLOR_ACCENT

    conclusions = [
        ("✔ Cobertura de Pruebas al 100%", "Todos los módulos principales (Inventario Geocercano, Productos, Sedes, Alertas IA y Traslados) han sido probados y verificados con datos reales y consistentes."),
        ("✔ Eliminación de Quiebres de Stock", "El motor predictivo y la compensación inter-sedes evitan la pérdida de pacientes y aseguran la disponibilidad de medicamentos esenciales."),
        ("✔ Red Nacional Operativa", "Soporte de 15 sedes estratégicas distribuidas en Lima, Arequipa, Cusco, Trujillo, Chiclayo y Huancayo con geolocalización Haversine."),
        ("✔ Conformidad Normativa y Legal", "Cumplimiento estricto de DIGEMID (BPA R.M. 833-2015), SUNAT (Guía de Remisión Electrónica GRE) y Ley 29733 de Protección de Datos Personales."),
        ("✔ Arquitectura Dockerizada y Escalable", "Microservicios Spring Boot, Gateway, Frontend React Vite y persistencia sincronizada listos para despliegue productivo.")
    ]

    for title, desc in conclusions:
        cp = etf.add_paragraph()
        cp.space_before = Pt(14)
        cp.text = f"{title}\n"
        cp.font.size = Pt(14)
        cp.font.bold = True
        cp.font.color.rgb = RGBColor(255, 255, 255)

        run = cp.add_run()
        run.text = f"   {desc}"
        run.font.size = Pt(12)
        run.font.bold = False
        run.font.color.rgb = RGBColor(203, 213, 225)

    prs.save(out_pptx)
    print(f"Presentación PPTX generada exitosamente en:\n{out_pptx}")

if __name__ == "__main__":
    build_presentation()
