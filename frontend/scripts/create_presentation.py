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
    blank_layout = prs.slide_layouts[6]

    # Paleta cromática corporativa y académica UTP / Farmacias Peruanas
    COLOR_PRIMARY = RGBColor(0, 43, 102)       # InkaFarma Azul Marino Profundo #002B66
    COLOR_ACCENT = RGBColor(255, 209, 0)       # InkaFarma Amarillo Oro #FFD100
    COLOR_UTP_RED = RGBColor(200, 16, 46)      # UTP Rojo Institucional #C8102E
    COLOR_TEAL = RGBColor(0, 191, 165)         # Teal / Menta #00BFA5 (Foto 1 y 2)
    COLOR_MIFARMA = RGBColor(211, 47, 47)      # Mifarma Rojo #D32F2F
    COLOR_SLATE_DARK = RGBColor(15, 23, 42)    # Slate 900
    COLOR_SLATE_MUTED = RGBColor(100, 116, 139) # Slate 500
    COLOR_CARD_BG = RGBColor(255, 255, 255)
    COLOR_LIGHT_BG = RGBColor(248, 250, 252)
    COLOR_CARD_BORDER = RGBColor(226, 232, 240)
    COLOR_BOX_LIGHT = RGBColor(238, 242, 246)
    COLOR_AMBER_BOX = RGBColor(254, 243, 199)

    screenshots_dir = r"C:\Users\Ronny Mendoza\.gemini\antigravity\brain\0d8a0e1e-14ef-4338-b8be-33749b4f2178\screenshots"
    out_brain = r"C:\Users\Ronny Mendoza\.gemini\antigravity\brain\0d8a0e1e-14ef-4338-b8be-33749b4f2178\PRUEBAS_SISTEMA_SIIP_FARMACIAS_AVANCE3.pptx"
    out_project = r"D:\UTP\5 SEMESTRE\Integrador\PROIYECTO\Farmacias\PRUEBAS_SISTEMA_SIIP_FARMACIAS_FINAL.pptx"

    def add_top_bar(slide, section_label, title_text):
        # Fondo general
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_LIGHT_BG
        bg.line.fill.background()

        # Barra superior azul marino
        header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(1.1))
        header.fill.solid()
        header.fill.fore_color.rgb = COLOR_PRIMARY
        header.line.fill.background()

        # Acento amarillo delgado
        accent = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(1.08), Inches(13.333), Inches(0.04))
        accent.fill.solid()
        accent.fill.fore_color.rgb = COLOR_ACCENT
        accent.line.fill.background()

        # Logo / Badge UTP rojo a la derecha
        utp_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.8), Inches(0.25), Inches(1.0), Inches(0.55))
        utp_box.fill.solid()
        utp_box.fill.fore_color.rgb = COLOR_UTP_RED
        utp_box.line.fill.background()
        utf_text = utp_box.text_frame
        utf_p = utf_text.paragraphs[0]
        utf_p.text = "UTP"
        utf_p.font.bold = True
        utf_p.font.size = Pt(14)
        utf_p.font.color.rgb = RGBColor(255, 255, 255)
        utf_p.alignment = PP_ALIGN.CENTER

        # Título
        tb = slide.shapes.add_textbox(Inches(0.6), Inches(0.12), Inches(11.0), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = section_label.upper()
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_ACCENT

        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(22)
        p1.font.bold = True
        p1.font.color.rgb = RGBColor(255, 255, 255)
        p1.space_before = Pt(2)

        # Footer
        footer = slide.shapes.add_textbox(Inches(0.6), Inches(7.18), Inches(12.0), Inches(0.28))
        ftf = footer.text_frame
        fp = ftf.paragraphs[0]
        fp.text = "CURSO INTEGRADOR I: SISTEMAS - SOFTWARE • AVANCE 3 • UTP 2026 • Mendoza Paucar Ronny (U25302314)"
        fp.font.size = Pt(8.5)
        fp.font.color.rgb = COLOR_SLATE_MUTED

    # =========================================================================
    # SLIDE 1: PORTADA EJECUTIVA Y ACADÉMICA
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_PRIMARY
    bg1.line.fill.background()

    bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.18), Inches(13.333), Inches(0.32))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = COLOR_ACCENT
    bar1.line.fill.background()

    # UTP Logo badge
    utp_portada = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(0.9), Inches(1.4), Inches(0.7))
    utp_portada.fill.solid()
    utp_portada.fill.fore_color.rgb = COLOR_UTP_RED
    utp_portada.line.fill.background()
    utp_p_tx = utp_portada.text_frame
    up_p = utp_p_tx.paragraphs[0]
    up_p.text = "UTP"
    up_p.font.bold = True
    up_p.font.size = Pt(20)
    up_p.font.color.rgb = RGBColor(255, 255, 255)
    up_p.alignment = PP_ALIGN.CENTER

    tx1 = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(5.0))
    tf1 = tx1.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "CURSO INTEGRADOR I: SISTEMAS - SOFTWARE (SECCIÓN 20065) • AVANCE 3"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_ACCENT

    p1 = tf1.add_paragraph()
    p1.text = "SISTEMA INTELIGENTE DE INVENTARIO Y PREDICCIÓN (SIIP)"
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)
    p1.space_before = Pt(12)

    p2 = tf1.add_paragraph()
    p2.text = "Optimización de Inventario, Geocercanía <10km y Traslados para Farmacias Peruanas"
    p2.font.size = Pt(18)
    p2.font.color.rgb = RGBColor(224, 231, 255)
    p2.space_before = Pt(6)

    p3 = tf1.add_paragraph()
    p3.text = (
        "\n• Estudiante: Mendoza Paucar Ronny Fernando (Cód. U25302314)\n"
        "• Colaborador / Equipo: Herrera Villanueva Luis Javier (GitHub: HerreraVillanuevaLuisJavier)\n"
        "• Docente: Mg. Irani Guillen Gomez\n"
        "• Stack Tecnológico: Spring Boot Microservices, PostgreSQL (8 Tablas), React Vite, Docker Compose\n"
        "• Librerías Requeridas: Google Guava, Apache POI, Apache Commons, Logback Integradas\n"
        "• Marco Regulatorio: DIGEMID (BPA R.M. 833-2015), SUNAT (GRE) y Ley 29733 de Datos Personales"
    )
    p3.font.size = Pt(12)
    p3.font.color.rgb = RGBColor(255, 255, 255)
    p3.space_before = Pt(16)

    # =========================================================================
    # SLIDE 2: MISIÓN Y VISIÓN EMPRESARIAL
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_top_bar(s2, "Contexto Estratégico", "Misión, Visión y Contexto de Farmacias Peruanas")

    # Tarjeta 1: Misión
    card_mision = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.5), Inches(5.3), Inches(5.2))
    card_mision.fill.solid()
    card_mision.fill.fore_color.rgb = COLOR_CARD_BG
    card_mision.line.color.rgb = COLOR_PRIMARY
    card_mision.line.width = Pt(2)
    tx_m = s2.shapes.add_textbox(Inches(1.2), Inches(1.7), Inches(4.9), Inches(4.8))
    tf_m = tx_m.text_frame
    tf_m.word_wrap = True
    pm0 = tf_m.paragraphs[0]
    pm0.text = "🎯 MISIÓN DEL PROYECTO"
    pm0.font.bold = True
    pm0.font.size = Pt(16)
    pm0.font.color.rgb = COLOR_PRIMARY

    pm1 = tf_m.add_paragraph()
    pm1.space_before = Pt(14)
    pm1.text = (
        "Desarrollar e implementar una plataforma tecnológica distribuida que garantice la "
        "disponibilidad oportuna de medicamentos esenciales en los más de 2,200 puntos de venta "
        "de Farmacias Peruanas (InkaFarma y Mifarma).\n\n"
        "El sistema interconecta el inventario en un radio geocercano menor a 10 km mediante "
        "el algoritmo Haversine, automatizando la compensación inter-sedes, mitigando quiebres de "
        "stock en mostrador y optimizando el capital de trabajo de la corporación bajo estricto "
        "cumplimiento normativo DIGEMID y SUNAT."
    )
    pm1.font.size = Pt(12.5)
    pm1.font.color.rgb = COLOR_SLATE_DARK

    # Tarjeta 2: Visión
    card_vision = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(1.5), Inches(5.3), Inches(5.2))
    card_vision.fill.solid()
    card_vision.fill.fore_color.rgb = COLOR_CARD_BG
    card_vision.line.color.rgb = COLOR_ACCENT
    card_vision.line.width = Pt(2)
    tx_v = s2.shapes.add_textbox(Inches(7.2), Inches(1.7), Inches(4.9), Inches(4.8))
    tf_v = tx_v.text_frame
    tf_v.word_wrap = True
    pv0 = tf_v.paragraphs[0]
    pv0.text = "👁️ VISIÓN DEL PROYECTO"
    pv0.font.bold = True
    pv0.font.size = Pt(16)
    pv0.font.color.rgb = COLOR_PRIMARY

    pv1 = tf_v.add_paragraph()
    pv1.space_before = Pt(14)
    pv1.text = (
        "Ser el estándar tecnológico de referencia a nivel nacional en logística predictiva "
        "y gestión inteligente de existencias para la industria farmacéutica peruana al 2026.\n\n"
        "Consolidar una red logística resiliente basada en microservicios contenerizados, con "
        "modelos predictivos de demanda que anticipen el 100% de quiebres con 7 días de anticipación, "
        "reduciendo las mermas por vencimiento mediante trazabilidad FEFO y elevando el nivel de "
        "servicio al paciente al 99.2% de efectividad de receta médica."
    )
    pv1.font.size = Pt(12.5)
    pv1.font.color.rgb = COLOR_SLATE_DARK

    # =========================================================================
    # SLIDE 3: OBJETIVOS GENERALES Y ESPECÍFICOS (RF-01 A RF-11)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_top_bar(s3, "Definición del Alcance", "Objetivos del Proyecto y Requisitos Funcionales")

    # Objetivo General
    box_og = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.7), Inches(1.2))
    box_og.fill.solid()
    box_og.fill.fore_color.rgb = COLOR_PRIMARY
    box_og.line.fill.background()
    tx_og = s3.shapes.add_textbox(Inches(1.0), Inches(1.45), Inches(11.3), Inches(1.1))
    tf_og = tx_og.text_frame
    tf_og.word_wrap = True
    pog0 = tf_og.paragraphs[0]
    pog0.text = "OBJETIVO GENERAL"
    pog0.font.bold = True
    pog0.font.size = Pt(12)
    pog0.font.color.rgb = COLOR_ACCENT
    pog1 = tf_og.add_paragraph()
    pog1.text = "Implementar un sistema software integral basado en microservicios, PostgreSQL y algoritmos predictivos para la gestión de inventario geocercano y traslados inter-sedes en Farmacias Peruanas."
    pog1.font.size = Pt(13)
    pog1.font.color.rgb = RGBColor(255, 255, 255)

    # Objetivos Específicos en 3 columnas
    col_w = Inches(3.7)
    gap = Inches(0.3)
    left_start = Inches(0.8)

    objs = [
        ("Seguridad y Autenticación (RF-01)", "Implementar acceso basado en roles (RBAC) con persistencia en PostgreSQL, encriptación BCrypt, control de 5 intentos fallidos con Guava y cumplimiento de Ley 29733."),
        ("Inventario y Geocercanía (RF-02)", "Desarrollar el cálculo geodésico de distancias mediante algoritmo Haversine para localizar stock disponible en sedes a menos de 10 km en tiempo real."),
        ("Predicción y Alertas FEFO (RF-03, RF-11)", "Construir un motor analítico que prediga quiebres a 7 días, calcule la velocidad de consumo diario y audite lotes por principio FEFO (BPA R.M. 833-2015).")
    ]

    for idx, (title, desc) in enumerate(objs):
        x = left_start + idx * (col_w + gap)
        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.8), col_w, Inches(4.0))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD_BG
        box.line.color.rgb = COLOR_CARD_BORDER
        box.line.width = Pt(1.5)

        tb = s3.shapes.add_textbox(x + Inches(0.15), Inches(2.95), col_w - Inches(0.3), Inches(3.7))
        tf = tb.text_frame
        tf.word_wrap = True

        pt0 = tf.paragraphs[0]
        pt0.text = title
        pt0.font.bold = True
        pt0.font.size = Pt(13)
        pt0.font.color.rgb = COLOR_PRIMARY

        pt1 = tf.add_paragraph()
        pt1.space_before = Pt(10)
        pt1.text = desc
        pt1.font.size = Pt(11)
        pt1.font.color.rgb = COLOR_SLATE_DARK

    # =========================================================================
    # SLIDE 4: CRONOGRAMA DE SPRINTS (METODOLOGÍA ÁGIL)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_top_bar(s4, "Planificación y Metodología", "Cronograma de Trabajo, Sprints y GitFlow (UTP 2026)")

    # Tabla de Cronograma de Sprints
    rows, cols = 10, 4
    table_shape = s4.shapes.add_table(rows, cols, Inches(0.8), Inches(1.4), Inches(11.7), Inches(5.4))
    t = table_shape.table
    t.columns[0].width = Inches(1.5)
    t.columns[1].width = Inches(2.8)
    t.columns[2].width = Inches(5.4)
    t.columns[3].width = Inches(2.0)

    headers = ["Sprint", "Módulo / Alcance", "Entregables Técnicos Principales", "Responsable / Fechas"]
    for c_idx, h_text in enumerate(headers):
        cell = t.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        cp = cell.text_frame.paragraphs[0]
        cp.text = h_text
        cp.font.bold = True
        cp.font.size = Pt(11)
        cp.font.color.rgb = COLOR_ACCENT

    sprint_data = [
        ("Sprint 1 (S1-S2)", "Arquitectura & Docker", "Reactor Maven multi-módulo, Shared Kernel, Docker Compose y Gateway", "R. Mendoza (08-11 Set)"),
        ("Sprint 2 (S3)", "Auth & Ley 29733", "Microservicio Auth, PostgreSQL, BCrypt, Honeypot y cookies", "L. Herrera (15-19 Set)"),
        ("Sprint 3 (S4)", "Inventario Geocercano", "Algoritmo Haversine, búsqueda reactiva, 15 sedes y minimapa", "R. Mendoza / L. Herrera"),
        ("Sprint 4 (S5)", "Productos & Kardex", "Vademécum, marcas vs genéricos, trazabilidad FEFO BPA DIGEMID", "L. Herrera (02-05 Oct)"),
        ("Sprint 5 (S6)", "Gestión de Sedes", "Ficha Técnica 360°, geocodificación, métricas de rotación", "L. Herrera (09-12 Oct)"),
        ("Sprint 6 (S7)", "Alertas Predictivas IA", "Motor IA consumo diario, predicción 7 días y autonomía", "R. Mendoza (15-18 Oct)"),
        ("Sprint 7 (S8)", "Traslados & GRE SUNAT", "Compensación inter-sedes, Guía de Remisión Electrónica y QR", "R. Mendoza (21-23 Oct)"),
        ("Sprint 8 (S9)", "UI/UX & Modales", "Layout widescreen fluido, sidebar sticky, Escape y backdrop click", "L. Herrera (24-25 Oct)"),
        ("Sprint 9 (S10)", "QA & Sustentación", "Suite E2E, exportador Apache POI, Logback y presentación PPTX", "R. Mendoza (25 Oct)")
    ]

    for r_idx, row in enumerate(sprint_data):
        for c_idx, val in enumerate(row):
            cell = t.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(255, 255, 255) if r_idx % 2 == 0 else RGBColor(241, 245, 249)
            cp = cell.text_frame.paragraphs[0]
            cp.text = val
            cp.font.size = Pt(10)
            cp.font.color.rgb = COLOR_SLATE_DARK

    # =========================================================================
    # SLIDE 5: ALCANCE REPORTADO (RÉPLICA EXACTA DE FOTO 1)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_top_bar(s5, "Diseño de la Solución", "Alcance Reportado del Proyecto SIIP")

    # Contenedor estilo Foto 1
    box_alcance = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.5))
    box_alcance.fill.solid()
    box_alcance.fill.fore_color.rgb = RGBColor(245, 247, 250)
    box_alcance.line.color.rgb = COLOR_TEAL
    box_alcance.line.width = Pt(3)

    # Subtítulo verde/teal como en la Foto 1
    tx_sub = s5.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(11.0), Inches(0.5))
    p_sub = tx_sub.text_frame.paragraphs[0]
    p_sub.text = "A L C A N C E   R E P O R T A D O"
    p_sub.font.bold = True
    p_sub.font.size = Pt(13)
    p_sub.font.color.rgb = COLOR_TEAL

    # Columna Izquierda (Foto 1)
    tx_left = s5.shapes.add_textbox(Inches(1.1), Inches(2.7), Inches(5.5), Inches(3.2))
    tf_left = tx_left.text_frame
    tf_left.word_wrap = True

    items_left = [
        "Base de datos PostgreSQL (8 tablas) con restricciones e índices",
        "Arquitectura en 4 capas: MVC, DAO, SOLID y TDD",
        "Motor del índice de impacto y de la prioridad (RF-02, RF-03)"
    ]
    for idx, item in enumerate(items_left):
        p = tf_left.paragraphs[0] if idx == 0 else tf_left.add_paragraph()
        if idx > 0: p.space_before = Pt(20)
        p.text = f"•   {item}"
        p.font.size = Pt(13.5)
        p.font.color.rgb = COLOR_SLATE_DARK

    # Columna Derecha (Foto 1)
    tx_right = s5.shapes.add_textbox(Inches(6.8), Inches(2.7), Inches(5.5), Inches(3.2))
    tf_right = tx_right.text_frame
    tf_right.word_wrap = True

    items_right = [
        "Registro de incidencias, login por rol y cola base (RF-01, RF-11, RF-05)",
        "Guava, Apache POI, Apache Commons y Logback integradas",
        "Git/GitHub con evidencia por commit y Docker sin credenciales"
    ]
    for idx, item in enumerate(items_right):
        p = tf_right.paragraphs[0] if idx == 0 else tf_right.add_paragraph()
        if idx > 0: p.space_before = Pt(20)
        p.text = f"•   {item}"
        p.font.size = Pt(13.5)
        p.font.color.rgb = COLOR_SLATE_DARK

    # =========================================================================
    # SLIDE 6: ARQUITECTURA EN 4 CAPAS: MVC, DAO, SOLID Y TDD (FOTO 2)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_top_bar(s6, "Diseño de la Solución", "Arquitectura en 4 capas: MVC, DAO, SOLID y TDD")

    # LADO IZQUIERDO: Diagrama de Cajas (Foto 2)
    # 1. Navegador
    b_nav = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(2.6), Inches(0.5))
    b_nav.fill.solid()
    b_nav.fill.fore_color.rgb = COLOR_BOX_LIGHT
    b_nav.line.color.rgb = COLOR_PRIMARY
    b_nav.text_frame.paragraphs[0].text = "Navegador"
    b_nav.text_frame.paragraphs[0].font.bold = True
    b_nav.text_frame.paragraphs[0].font.size = Pt(10.5)
    b_nav.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    # 2. Spring Security
    b_sec = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.1), Inches(5.5), Inches(0.45))
    b_sec.fill.solid()
    b_sec.fill.fore_color.rgb = RGBColor(240, 253, 250)
    b_sec.line.color.rgb = COLOR_TEAL
    b_sec.line.width = Pt(1.5)
    b_sec.text_frame.paragraphs[0].text = "Spring Security: autenticación por rol, CSRF, BCrypt"
    b_sec.text_frame.paragraphs[0].font.bold = True
    b_sec.text_frame.paragraphs[0].font.size = Pt(10)
    b_sec.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    b_sec.text_frame.paragraphs[0].font.color.rgb = COLOR_PRIMARY

    # 3. Controladores y Vistas
    b_ctrl = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.65), Inches(2.6), Inches(0.75))
    b_ctrl.fill.solid()
    b_ctrl.fill.fore_color.rgb = COLOR_CARD_BG
    b_ctrl.line.color.rgb = COLOR_PRIMARY
    b_ctrl.line.width = Pt(1.5)
    c_tf = b_ctrl.text_frame
    c_tf.paragraphs[0].text = "CONTROLADORES"
    c_tf.paragraphs[0].font.bold = True
    c_tf.paragraphs[0].font.size = Pt(11)
    c_tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    c_tf.add_paragraph().text = "Spring MVC • Auth / Traslado"
    c_tf.paragraphs[1].font.size = Pt(8.5)
    c_tf.paragraphs[1].alignment = PP_ALIGN.CENTER

    b_vist = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.7), Inches(2.65), Inches(2.6), Inches(0.75))
    b_vist.fill.solid()
    b_vist.fill.fore_color.rgb = COLOR_BOX_LIGHT
    b_vist.line.color.rgb = COLOR_SLATE_MUTED
    v_tf = b_vist.text_frame
    v_tf.paragraphs[0].text = "VISTAS"
    v_tf.paragraphs[0].font.bold = True
    v_tf.paragraphs[0].font.size = Pt(11)
    v_tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    v_tf.add_paragraph().text = "React Vite + CSS • login, panel"
    v_tf.paragraphs[1].font.size = Pt(8.5)
    v_tf.paragraphs[1].alignment = PP_ALIGN.CENTER

    # 4. Servicios y Librerías de Apoyo
    b_serv = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.55), Inches(2.6), Inches(0.75))
    b_serv.fill.solid()
    b_serv.fill.fore_color.rgb = RGBColor(240, 253, 250)
    b_serv.line.color.rgb = COLOR_TEAL
    b_serv.line.width = Pt(1.5)
    s_tf = b_serv.text_frame
    s_tf.paragraphs[0].text = "SERVICIOS"
    s_tf.paragraphs[0].font.bold = True
    s_tf.paragraphs[0].font.size = Pt(11)
    s_tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    s_tf.add_paragraph().text = "AuthService • TrasladoService"
    s_tf.paragraphs[1].font.size = Pt(8.5)
    s_tf.paragraphs[1].alignment = PP_ALIGN.CENTER

    b_lib = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.7), Inches(3.55), Inches(2.6), Inches(0.75))
    b_lib.fill.solid()
    b_lib.fill.fore_color.rgb = COLOR_AMBER_BOX
    b_lib.line.color.rgb = RGBColor(217, 119, 6)
    b_lib.line.width = Pt(1.5)
    l_tf = b_lib.text_frame
    l_tf.paragraphs[0].text = "Librerías de apoyo"
    l_tf.paragraphs[0].font.bold = True
    l_tf.paragraphs[0].font.size = Pt(10.5)
    l_tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    l_tf.add_paragraph().text = "Guava • POI • Commons • Logback"
    l_tf.paragraphs[1].font.size = Pt(8.5)
    l_tf.paragraphs[1].alignment = PP_ALIGN.CENTER

    # 5. DAO y PostgreSQL
    b_dao = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.45), Inches(2.6), Inches(0.75))
    b_dao.fill.solid()
    b_dao.fill.fore_color.rgb = COLOR_CARD_BG
    b_dao.line.color.rgb = COLOR_PRIMARY
    b_dao.line.width = Pt(1.5)
    d_tf = b_dao.text_frame
    d_tf.paragraphs[0].text = "DAO"
    d_tf.paragraphs[0].font.bold = True
    d_tf.paragraphs[0].font.size = Pt(11)
    d_tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    d_tf.add_paragraph().text = "Spring Data JPA • UsuarioDao"
    d_tf.paragraphs[1].font.size = Pt(8.5)
    d_tf.paragraphs[1].alignment = PP_ALIGN.CENTER

    b_pg = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.7), Inches(4.45), Inches(2.6), Inches(0.75))
    b_pg.fill.solid()
    b_pg.fill.fore_color.rgb = COLOR_BOX_LIGHT
    b_pg.line.color.rgb = COLOR_PRIMARY
    pg_tf = b_pg.text_frame
    pg_tf.paragraphs[0].text = "PostgreSQL"
    pg_tf.paragraphs[0].font.bold = True
    pg_tf.paragraphs[0].font.size = Pt(11)
    pg_tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    pg_tf.add_paragraph().text = "8 tablas con índices"
    pg_tf.paragraphs[1].font.size = Pt(8.5)
    pg_tf.paragraphs[1].alignment = PP_ALIGN.CENTER

    # LADO DERECHO: Tabla de Definición MVC, DAO, SOLID, TDD (Foto 2)
    def_items = [
        ("MVC", "Controladores, servicios y vistas separados."),
        ("DAO", "Interfaces *Dao con Spring Data JPA; los servicios no escriben SQL."),
        ("SOLID", "CalculadorImpacto / AuthService (interfaz) + inyección por constructor."),
        ("TDD", "AuthServiceImplTest / ImpactoTest se escribe antes de la implementación.")
    ]
    for idx, (lbl, desc) in enumerate(def_items):
        y = Inches(1.5) + idx * Inches(0.95)
        # Etiqueta
        etq = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.6), y, Inches(1.2), Inches(0.8))
        etq.fill.solid()
        etq.fill.fore_color.rgb = COLOR_TEAL if idx < 2 else (RGBColor(30, 58, 138) if idx == 2 else RGBColor(234, 88, 12))
        etq.line.fill.background()
        etq.text_frame.paragraphs[0].text = lbl
        etq.text_frame.paragraphs[0].font.bold = True
        etq.text_frame.paragraphs[0].font.size = Pt(14)
        etq.text_frame.paragraphs[0].font.color.rgb = RGBColor(255, 255, 255)
        etq.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

        # Contenido
        ctn = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(7.8), y, Inches(4.7), Inches(0.8))
        ctn.fill.solid()
        ctn.fill.fore_color.rgb = COLOR_BOX_LIGHT
        ctn.line.color.rgb = COLOR_CARD_BORDER
        cp = ctn.text_frame.paragraphs[0]
        cp.text = desc
        cp.font.size = Pt(10.5)
        cp.font.color.rgb = COLOR_SLATE_DARK

    # BARRA INFERIOR: SEGURIDAD (Pastillas como en Foto 2)
    pills_title = s6.shapes.add_textbox(Inches(0.8), Inches(5.4), Inches(11.7), Inches(0.3))
    pills_title.text_frame.paragraphs[0].text = "S E G U R I D A D"
    pills_title.text_frame.paragraphs[0].font.bold = True
    pills_title.text_frame.paragraphs[0].font.size = Pt(10)
    pills_title.text_frame.paragraphs[0].font.color.rgb = RGBColor(234, 88, 12)

    pills = [
        "Hash BCrypt", "Acceso por rol", "CSRF", "Bloqueo a los 5 intentos",
        "Validación y escape", "Auditoría en log", "Claves fuera del repositorio"
    ]
    pill_w = Inches(1.58)
    pill_gap = Inches(0.11)
    for idx, pill in enumerate(pills):
        px = Inches(0.8) + idx * (pill_w + pill_gap)
        pb = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, Inches(5.8), pill_w, Inches(0.5))
        pb.fill.solid()
        pb.fill.fore_color.rgb = COLOR_CARD_BG
        pb.line.color.rgb = COLOR_TEAL
        pb.line.width = Pt(1.5)
        pp = pb.text_frame.paragraphs[0]
        pp.text = pill
        pp.font.bold = True
        pp.font.size = Pt(8.5)
        pp.font.color.rgb = COLOR_PRIMARY
        pp.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 7: ESTRUCTURA DE PAQUETES DEL PROYECTO (FOTO 3)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_top_bar(s7, "Diseño de la Solución • Estructura", "Estructura de paquetes del proyecto")

    # Tabla réplica Foto 3
    t7_shape = s7.shapes.add_table(9, 3, Inches(0.8), Inches(1.4), Inches(11.7), Inches(5.4))
    t7 = t7_shape.table
    t7.columns[0].width = Inches(2.2)
    t7.columns[1].width = Inches(5.5)
    t7.columns[2].width = Inches(4.0)

    h7 = ["Paquete", "Responsabilidad", "Ejemplos"]
    for c_idx, h in enumerate(h7):
        cell = t7.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        cp = cell.text_frame.paragraphs[0]
        cp.text = h
        cp.font.bold = True
        cp.font.size = Pt(11)
        cp.font.color.rgb = COLOR_ACCENT

    rows7 = [
        ("controller", "Recibe solicitudes HTTP, valida formularios y elige la vista (MVC)", "AuthController, TrasladoController, ReporteExcelController"),
        ("service", "Reglas de negocio y motor de impacto; no conoce HTTP ni SQL", "AuthService, TrasladoService, ExcelReportService"),
        ("dao", "Acceso a datos mediante interfaces (patrón DAO)", "UsuarioDao, RolDao, SucursalDao, AuditoriaEventoDao"),
        ("model", "Entidades JPA que representan las tablas", "Usuario, Rol, Sucursal, Medicamento, Traslado, AuditoriaEvento"),
        ("dto / enums", "Objetos de transferencia y enumeraciones del dominio", "LoginRequest, JwtResponse, Prioridad, EstadoTraslado"),
        ("config", "Seguridad, auditoría y manejo de errores", "SecurityConfig, AuthEventsListener, CorsConfig"),
        ("util / exception", "Utilidades de texto y excepciones de negocio", "SanitizadorTexto (Apache Commons), ReglaNegocioException"),
        ("resources", "Vistas, scripts SQL y configuración de logging", "db/schema.sql, db/data.sql, logback-spring.xml")
    ]

    for r_idx, row in enumerate(rows7):
        for c_idx, val in enumerate(row):
            cell = t7.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(255, 255, 255) if r_idx % 2 == 0 else RGBColor(241, 245, 249)
            cp = cell.text_frame.paragraphs[0]
            cp.text = val
            cp.font.size = Pt(10)
            cp.font.bold = (c_idx == 0)
            cp.font.color.rgb = COLOR_PRIMARY if c_idx == 0 else COLOR_SLATE_DARK

    # =========================================================================
    # SLIDE 8: LIBRERÍAS DE APOYO INTEGRADAS (GUAVA, POI, COMMONS, LOGBACK)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_top_bar(s8, "Tecnologías y Librerías Requeridas", "Integración de Guava, Apache POI, Apache Commons y Logback")

    libs = [
        ("1. Google Guava (v33.0.0)", "Control de Tasa y Rate Limiting", "LoadingCache en memoria con expiración a 15 min para bloquear cuentas automáticamente al superar 5 intentos fallidos consecutivos. Uso de Preconditions para validaciones defensivas de argumentos."),
        ("2. Apache POI (v5.2.5)", "Exportación Excel (.xlsx)", "Generación nativa de hojas de cálculo XSSFWorkbook con formato corporativo (cabeceras azul marino, auto-filtro, estilos) para auditorías de seguridad, trazabilidad de usuarios y reportes Kardex."),
        ("3. Apache Commons (v3.14)", "Sanitización y Validación Defensiva", "Utilización de StringUtils.isNotBlank(), trimToEmpty() y sanitización de caracteres especiales para prevenir ataques de Cross-Site Scripting (XSS) e inyección SQL en la capa de servicios."),
        ("4. Logback (logback-spring.xml)", "Auditoría Estructurada de Seguridad", "Configuración de appenders rotativos diarios con compresión .gz y patrones coloreados. Registro formal de eventos de login, bloqueo de IP y transferencias para auditoría regulatoria DIGEMID.")
    ]

    col_w8 = Inches(2.75)
    gap8 = Inches(0.23)
    for idx, (lib_name, rol, desc) in enumerate(libs):
        lx = Inches(0.8) + idx * (col_w8 + gap8)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, lx, Inches(1.5), col_w8, Inches(5.3))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_PRIMARY
        card.line.width = Pt(1.5)

        tb = s8.shapes.add_textbox(lx + Inches(0.15), Inches(1.65), col_w8 - Inches(0.3), Inches(5.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = lib_name
        p0.font.bold = True
        p0.font.size = Pt(12.5)
        p0.font.color.rgb = COLOR_PRIMARY

        p1 = tf.add_paragraph()
        p1.space_before = Pt(8)
        p1.text = rol.upper()
        p1.font.bold = True
        p1.font.size = Pt(9.5)
        p1.font.color.rgb = RGBColor(217, 119, 6)

        p2 = tf.add_paragraph()
        p2.space_before = Pt(12)
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_SLATE_DARK

    # =========================================================================
    # SLIDE 9: ¿POR QUÉ MICROSERVICIOS? JUSTIFICACIÓN TÉCNICA
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_top_bar(s9, "Decisiones de Arquitectura", "Conclusiones Técnicas: ¿Por qué elegimos Microservicios?")

    ms_reasons = [
        ("1. Desacoplamiento por Dominios de Negocio (DDD)", "En una corporación como Farmacias Peruanas con más de 2,200 boticas, el dominio de Autenticación, el Inventario Geocercano, las Alertas IA y la Logística de Traslados tienen ciclos de vida y lógicas totalmente independientes. Un fallo en el cálculo analítico no debe interrumpir la ventanilla de venta."),
        ("2. Escalabilidad Asimétrica e Independiente", "El motor predictivo de demanda y el cálculo Haversine de geocercanía demandan alta capacidad de cómputo en picos horarios de reposición. Los microservicios permiten escalar horizontalmente solo el servicio de predicción sin sobredimensionar la base de datos de usuarios ni el gateway."),
        ("3. Aislamiento de Fallos y Alta Disponibilidad", "Si el módulo de emisión de Guías SUNAT experimenta latencia por caída del servicio web tributario, el resto del sistema (búsqueda de stock, dispensación y login) continúa operando con normalidad. En un monolito, una falla en un hilo bloquearía toda la aplicación."),
        ("4. Despliegue Continuo y Contenerización Docker", "Cada microservicio posee su propio Dockerfile optimizado y pipelines CI/CD independientes. Esto reduce el tiempo de compilación, permite actualizaciones sin caída de servicio (Zero Downtime) y facilita la integración con Kubernetes y PostgreSQL distribuido.")
    ]

    for idx, (title, desc) in enumerate(ms_reasons):
        y = Inches(1.5) + idx * Inches(1.3)
        box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(1.18))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD_BG
        box.line.color.rgb = COLOR_CARD_BORDER

        bar = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), y, Inches(0.18), Inches(1.18))
        bar.fill.solid()
        bar.fill.fore_color.rgb = COLOR_PRIMARY
        bar.line.fill.background()

        tb = s9.shapes.add_textbox(Inches(1.2), y + Inches(0.1), Inches(11.1), Inches(0.98))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.bold = True
        p0.font.size = Pt(12.5)
        p0.font.color.rgb = COLOR_PRIMARY

        p1 = tf.add_paragraph()
        p1.space_before = Pt(4)
        p1.text = desc
        p1.font.size = Pt(10.5)
        p1.font.color.rgb = COLOR_SLATE_DARK

    # =========================================================================
    # SLIDE 10: BASE DE DATOS POSTGRESQL (8 TABLAS E ÍNDICES)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_top_bar(s10, "Persistencia de Datos", "Modelo Relacional PostgreSQL (8 Tablas, Restricciones e Índices)")

    t10_shape = s10.shapes.add_table(9, 3, Inches(0.8), Inches(1.4), Inches(11.7), Inches(5.4))
    t10 = t10_shape.table
    t10.columns[0].width = Inches(2.2)
    t10.columns[1].width = Inches(4.5)
    t10.columns[2].width = Inches(5.0)

    h10 = ["Tabla PostgreSQL", "Campos Clave y Restricciones", "Índices de Optimización y Rol en SIIP"]
    for c_idx, h in enumerate(h10):
        cell = t10.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        cp = cell.text_frame.paragraphs[0]
        cp.text = h
        cp.font.bold = True
        cp.font.size = Pt(11)
        cp.font.color.rgb = COLOR_ACCENT

    db_tables = [
        ("1. sucursales", "id, codigo UNIQUE, marca, direccion, lat, lng, es_cd", "idx_sucursales_codigo. Red nacional de 15 sedes en Perú."),
        ("2. roles", "id, codigo UNIQUE, nombre, descripcion", "Control de perfiles RBAC (QF, Admin CD, Supervisor)."),
        ("3. usuarios", "id, username UNIQUE, password_hash (BCrypt), rol_id, bloqueado", "idx_usuarios_username. Auth PostgreSQL y bloqueo a 5 intentos."),
        ("4. medicamentos", "id, codigo_ean UNIQUE, codigo_can, principio_activo, categoria", "Vademécum oficial farmacéutico con marcas vs genéricos."),
        ("5. inventarios", "id, sucursal_id, medicamento_id, stock_actual, estado_stock", "idx_inventarios_sucursal. Control reactivo de existencias."),
        ("6. lotes_caducidad", "id, numero_lote, fecha_vencimiento, semaforo_fefo", "idx_lotes_vencimiento, idx_lotes_fefo. Trazabilidad BPA DIGEMID."),
        ("7. traslados", "id, codigo_traslado UNIQUE, origen_id, destino_id, guia_remision", "idx_traslados_estado. Guía de Remisión Electrónica GRE SUNAT."),
        ("8. auditoria_eventos", "id, usuario_id, username, accion, ip_origen, fecha_hora", "idx_auditoria_fecha. Trazabilidad completa con Logback.")
    ]

    for r_idx, row in enumerate(db_tables):
        for c_idx, val in enumerate(row):
            cell = t10.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(255, 255, 255) if r_idx % 2 == 0 else RGBColor(241, 245, 249)
            cp = cell.text_frame.paragraphs[0]
            cp.text = val
            cp.font.size = Pt(10)
            cp.font.bold = (c_idx == 0)
            cp.font.color.rgb = COLOR_PRIMARY if c_idx == 0 else COLOR_SLATE_DARK

    # =========================================================================
    # SLIDE 10B: CONTROL DE ACCESO RBAC - LOS 5 ROLES INDISPENSABLES
    # =========================================================================
    s_roles = prs.slides.add_slide(blank_layout)
    add_top_bar(s_roles, "Control de Acceso y Seguridad RBAC", "Los 5 Roles Indispensables del Negocio Farmacéutico (DIGEMID & SUNAT)")

    t_roles_shape = s_roles.shapes.add_table(6, 4, Inches(0.8), Inches(1.4), Inches(11.7), Inches(5.4))
    t_roles = t_roles_shape.table
    t_roles.columns[0].width = Inches(2.2)
    t_roles.columns[1].width = Inches(2.3)
    t_roles.columns[2].width = Inches(5.0)
    t_roles.columns[3].width = Inches(2.2)

    h_roles = ["Código de Rol (PostgreSQL)", "Perfil Operativo", "Responsabilidades y Base Legal (DIGEMID / SUNAT)", "Usuario de Prueba"]
    for c_idx, h in enumerate(h_roles):
        cell = t_roles.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        cp = cell.text_frame.paragraphs[0]
        cp.text = h
        cp.font.bold = True
        cp.font.size = Pt(11)
        cp.font.color.rgb = COLOR_ACCENT

    roles_data = [
        ("ROLE_FARMACEUTICO", "Químico Farmacéutico (Director Técnico)", "Dispensación ética, recetas médicas, control FEFO de psicotrópicos y transferencias inter-sucursales (Ley 29459, R.M. 833-2015).", "qf_mendoza (CQFP 18492)"),
        ("ROLE_ADMIN_CD", "Administrador CD (Huachipa)", "Gestión logística mayorista, emisión de Guías Remitente SUNAT con QR/HASH, despacho inter-sedes y recepción de laboratorios.", "admin_cd_huachipa (CIP 84920)"),
        ("ROLE_SUPERVISOR", "Supervisor Regional Operaciones", "Monitoreo global de la red (15 sedes a nivel nacional), balanceo de sobrestock entre boticas, control de mermas y auditoría.", "supervisor_nacional"),
        ("ROLE_ASISTENTE_FARMACIA", "Técnico en Farmacia (Ventanilla)", "Atención en ventanilla, consulta rápida de genéricos DCI con fotos en Cloudflare R2, registro de venta y recepción conforme.", "tecnico_ventanilla"),
        ("ROLE_AUDITOR_CALIDAD", "Auditor Calidad & DIGEMID", "Fiscalización de Buenas Prácticas de Almacenamiento (BPA), trazabilidad FEFO de lotes por vencer y descarga de reportes Apache POI.", "auditor_digemid (CQFP 14205)")
    ]

    for r_idx, row in enumerate(roles_data):
        for c_idx, val in enumerate(row):
            cell = t_roles.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(255, 255, 255) if r_idx % 2 == 0 else RGBColor(241, 245, 249)
            cp = cell.text_frame.paragraphs[0]
            cp.text = val
            cp.font.size = Pt(10)
            cp.font.bold = (c_idx == 0 or c_idx == 3)
            cp.font.color.rgb = COLOR_PRIMARY if c_idx == 0 else (COLOR_UTP_RED if c_idx == 3 else COLOR_SLATE_DARK)

    # =========================================================================
    # SLIDES 11 A 21: PANTALLAS Y EVIDENCIAS DE PRUEBAS FUNCIONALES
    # =========================================================================
    screens = [
        ("Acceso Seguro con PostgreSQL y BCrypt (CU01)", "Módulo de Autenticación y Seguridad", [
            ("Persistencia en PostgreSQL", "Validación contra la tabla 'usuarios' con hash BCrypt de alta seguridad ($2a$10$)."),
            ("Bloqueo a los 5 Intentos (Guava)", "Rate limiting en memoria que inhabilita temporalmente la cuenta por 15 minutos."),
            ("Cumplimiento Ley 29733", "Consentimiento explícito de tratamiento de datos personales y banner de cookies."),
            ("Auditoría en Logback", "Registro en logs/siip-security-audit.log de cada intento exitoso o fallido.")
        ], "01_login.png"),

        ("Panel de Control Ejecutivo & Red de 15 Sedes", "Dashboard Operativo y Métricas", [
            ("Visibilidad en Tiempo Real", "Monitoreo del inventario total valorizado en soles (PEN) en toda la cadena."),
            ("Indicador de Quiebres Críticos", "Alerta temprana de ítems en stock cero o próximo a agotarse con semaforización."),
            ("Trazabilidad de Traslados", "Contador de órdenes de transferencia pendientes, despachadas y recepcionadas."),
            ("Repositorio Cloudflare R2", "Verificación del bucket público para almacenamiento de fichas técnicas.")
        ], "02_dashboard.png"),

        ("Búsqueda Inteligente e Inventario Geocercano (CU02)", "Módulo de Inventario Geocercano", [
            ("Algoritmo Haversine", "Cálculo geodésico exacto en kilómetros entre la sede del paciente y sedes donantes (<10km)."),
            ("Red Nacional de 15 Sedes", "Cobertura completa en Lima, Arequipa, Cusco, Trujillo, Chiclayo y Huancayo."),
            ("Filtros Macrorregionales", "Segmentación rápida por Norte, Centro, Sur y Lima con buscador por distrito."),
            ("Doble Acción Inmediata", "Botón directo 'Ruta & Mapa' para orientar al paciente y 'Solicitar Traslado'.")
        ], "03_inventario_geocercano.png"),

        ("Solicitud de Traslado Inter-Sedes con IA (CU03)", "Módulo de Compensación de Stock", [
            ("Lote Sugerido por IA", "Cálculo algorítmico que optimiza el stock receptor sin desabastecer la sede donante."),
            ("Simulación Antes ➔ Después", "Proyección visual del saldo restante en origen y el nuevo stock en destino."),
            ("Valoración Económica Automática", "Cálculo del costo total en soles (S/ PEN) del lote para control de mermas."),
            ("Priorización Operativa", "Opciones de despacho Normal (4h), Urgente (1-2h) o Crítico Express.")
        ], "04_modal_solicitar_traslado.png"),

        ("Minimapa de Orientación y Guía WhatsApp al Paciente", "Módulo de Experiencia del Paciente", [
            ("Geolocalización Dinámica OSM", "Minimapa interactivo OpenStreetMap centrado en las coordenadas de la botica donante."),
            ("Estimación de Tiempos", "Cálculo del tiempo promedio en automóvil y a pie hacia la sucursal con stock."),
            ("Generador WhatsApp", "Copia formal con dirección, referencia, stock y enlace a Google Maps para el paciente."),
            ("No Pérdida de Venta", "Garantiza que el paciente encuentre su medicina en la misma cadena en <10 minutos.")
        ], "05_modal_ruta_mapa.png"),

        ("Gestión de Catálogo y Productos Farmacéuticos", "Módulo de Gestión de Productos", [
            ("Catálogo Multicategoría", "Antibióticos, Analgésicos, Antiinflamatorios y Oncológicos con EAN-13 y CAN DIGEMID."),
            ("Clasificación Marca vs Genérico", "Filtro para cumplir con la política nacional de disponibilidad de genéricos."),
            ("Ajuste de Stock Auditado", "Registro de ingresos físicos, regularizaciones y mermas con motivo justificado."),
            ("Conexión con Kardex FEFO", "Acceso directo a la hoja de vida, historial de movimientos y lotes de cada fármaco.")
        ], "06_gestion_productos.png"),

        ("Trazabilidad por Lote y Kardex FEFO (BPA DIGEMID)", "Auditoría y Buenas Prácticas Farmacéuticas", [
            ("Principio FEFO", "Garantiza la salida prioritaria de lotes con fecha de vencimiento más próxima."),
            ("Registro de Lote y Sanitario", "Trazabilidad con código de lote del fabricante y registro sanitario oficial."),
            ("Historial Cronológico", "Auditoría de Entradas, Salidas por Venta y Traslados con usuario responsable."),
            ("Certificación DIGEMID", "Cumplimiento estricto del Manual de BPA aprobado por R.M. N° 833-2015/MINSA.")
        ], "07_modal_kardex_trazabilidad.png"),

        ("Administración Centralizada de 15 Sedes en el Perú", "Módulo de Gestión de Sedes", [
            ("Distribución Geográfica Nacional", "10 sedes en Lima Metropolitana y Callao + 5 sedes en Arequipa, Cusco, Trujillo, Chiclayo y Huancayo."),
            ("Ficha Técnica 360°", "Dirección exacta, teléfono, horario de atención y Director Técnico colegiado."),
            ("Métricas Operativas", "Monitoreo del total de medicamentos, stock crítico y balance de transferencias."),
            ("Filtros por Cadena", "Clasificación instantánea entre InkaFarma, Mifarma y CD Huachipa.")
        ], "08_gestion_sedes.png"),

        ("Motor de Alertas Predictivas de Demanda con IA (CU04)", "Módulo de Inteligencia Predictiva", [
            ("Consumo Diario Promedio", "Algoritmo estadístico que analiza la dispensación para estimar la tasa diaria de salida."),
            ("Predicción de Quiebre a 7 Días", "Identifica fármacos que agotarán existencias en menos de 7 días preventivamente."),
            ("Autonomía Operativa en Días", "Calcula la cantidad de días de cobertura restante por sucursal."),
            ("Acción Inmediata", "Generación preventiva de traslados inter-sedes con un clic desde el panel de alertas.")
        ], "09_alertas_predictivas.png"),

        ("Bandeja de Traslados y Guía de Remisión GRE SUNAT (CU05)", "Módulo de Logística y Tributación", [
            ("Flujo de Estados Operativos", "Seguimiento riguroso: PENDIENTE ➔ DESPACHADO ➔ EN TRÁNSITO ➔ COMPLETADO."),
            ("Guía de Remisión (GRE)", "Cumplimiento SUNAT con serie correlativa, RUC transportista, placa y precinto."),
            ("Código QR y Firma Fiscal", "Generación del código QR de validación fiscal y trazabilidad de custodia."),
            ("Recepción con Control de Calidad", "Inspección de precintos íntegros y temperatura al recepcionar mercadería.")
        ], "10_gestion_traslados.png")
    ]

    for title, module_tag, points, screenshot in screens:
        slide = prs.slides.add_slide(blank_layout)
        add_top_bar(slide, module_tag, title)

        # Panel Izquierdo: Descripción
        card_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.3), Inches(4.5), Inches(5.8))
        card_box.fill.solid()
        card_box.fill.fore_color.rgb = COLOR_CARD_BG
        card_box.line.color.rgb = COLOR_CARD_BORDER
        card_box.line.width = Pt(1)

        tx_card = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(4.1), Inches(5.4))
        ctf = tx_card.text_frame
        ctf.word_wrap = True

        cp0 = ctf.paragraphs[0]
        cp0.text = "🎯 Criterios y Verificación de Prueba:"
        cp0.font.size = Pt(13)
        cp0.font.bold = True
        cp0.font.color.rgb = COLOR_PRIMARY

        for b_title, b_desc in points:
            bp = ctf.add_paragraph()
            bp.space_before = Pt(10)
            bp.text = f"✔ {b_title}: "
            bp.font.size = Pt(11)
            bp.font.bold = True
            bp.font.color.rgb = COLOR_SLATE_DARK

            run = bp.add_run()
            run.text = b_desc
            run.font.size = Pt(10)
            run.font.bold = False
            run.font.color.rgb = COLOR_SLATE_MUTED

        # Panel Derecho: Captura real
        img_path = os.path.join(screenshots_dir, screenshot)
        if os.path.exists(img_path):
            img_card = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.3), Inches(1.3), Inches(7.4), Inches(5.8))
            img_card.fill.solid()
            img_card.fill.fore_color.rgb = COLOR_CARD_BG
            img_card.line.color.rgb = COLOR_CARD_BORDER
            img_card.line.width = Pt(1.5)

            slide.shapes.add_picture(img_path, Inches(5.35), Inches(1.35), width=Inches(7.3), height=Inches(5.7))

    # =========================================================================
    # SLIDE 22: CONCLUSIONES FINALES Y MATRIZ DE VALIDACIÓN
    # =========================================================================
    s_end = prs.slides.add_slide(blank_layout)
    bg_end = s_end.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg_end.fill.solid()
    bg_end.fill.fore_color.rgb = COLOR_PRIMARY
    bg_end.line.fill.background()

    bar_end = s_end.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.18), Inches(13.333), Inches(0.32))
    bar_end.fill.solid()
    bar_end.fill.fore_color.rgb = COLOR_ACCENT
    bar_end.line.fill.background()

    tx_end = s_end.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(6.0))
    etf = tx_end.text_frame
    etf.word_wrap = True

    ep0 = etf.paragraphs[0]
    ep0.text = "CONCLUSIONES Y VALIDACIÓN DEL SISTEMA SIIP (AVANCE 3)"
    ep0.font.size = Pt(26)
    ep0.font.bold = True
    ep0.font.color.rgb = COLOR_ACCENT

    conclusions = [
        ("✔ Cobertura Integral de Requisitos (RF-01 a RF-11)", "Todos los casos de uso (CU01 al CU05) han sido probados y validados con datos consistentes y flujos completos de inicio a fin."),
        ("✔ Arquitectura en 4 Capas Conforme a Estándares", "Separación estricta de responsabilidades (MVC, DAO, SOLID, TDD) asegurando mantenibilidad, bajo acoplamiento y alta cohesión."),
        ("✔ Integración de Librerías Requeridas", "Uso activo de Google Guava (bloqueo a los 5 intentos), Apache POI (exportación .xlsx), Apache Commons (sanitización) y Logback (auditoría)."),
        ("✔ Seguridad y Autenticación PostgreSQL", "Almacenamiento seguro de credenciales con hash BCrypt, control de acceso por roles y persistencia relacional en 8 tablas normalizadas."),
        ("✔ Despliegue Contenerizado con Docker", "Entorno homogéneo y reproducible con Docker Compose, facilitando la ejecución independiente de microservicios y frontend.")
    ]

    for title, desc in conclusions:
        cp = etf.add_paragraph()
        cp.space_before = Pt(12)
        cp.text = f"{title}\n"
        cp.font.size = Pt(13)
        cp.font.bold = True
        cp.font.color.rgb = RGBColor(255, 255, 255)

        run = cp.add_run()
        run.text = f"   {desc}"
        run.font.size = Pt(11)
        run.font.bold = False
        run.font.color.rgb = RGBColor(203, 213, 225)

    # Guardar en ambas ubicaciones (Brain y Proyecto)
    prs.save(out_brain)
    print(f"Presentación generada exitosamente en:\n{out_brain}")

    try:
        prs.save(out_project)
        print(f"Copia guardada en proyecto:\n{out_project}")
    except Exception as e:
        print(f"Aviso al guardar en proyecto: {e}")

if __name__ == "__main__":
    build_presentation()
