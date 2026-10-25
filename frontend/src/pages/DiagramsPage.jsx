import React, { useState } from 'react';
import { 
  Layers, 
  FileText, 
  Workflow, 
  Server, 
  Database, 
  Calendar
} from 'lucide-react';

export default function DiagramsPage() {
  const [activeSection, setActiveSection] = useState('casos_de_uso');

  const sections = [
    { id: 'casos_de_uso', label: '1. Casos de Uso UML & RUP', icon: FileText },
    { id: 'bpmn', label: '2. Proceso de Negocio BPMN 2.0', icon: Workflow },
    { id: 'arquitectura', label: '3. Arquitectura Microservicios', icon: Server },
    { id: 'database', label: '4. Modelo Entidad-Relación', icon: Database },
    { id: 'wbs_gantt', label: '5. WBS & Diagrama de Gantt', icon: Calendar }
  ];

  return (
    <div className="space-y-6 w-full">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Documentación Técnica • Curso Integrador I</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Diagramas de Ingeniería y Especificación del Sistema
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modelos visuales y fichas técnicas listos para la memoria técnica y sustentación del proyecto.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl text-xs text-blue-900 font-bold">
          Alumno: Mendoza Paucar Ronny Fernando
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-200">
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={"flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer " + (
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* SECTION 1: Casos de Uso */}
        {activeSection === 'casos_de_uso' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              1. Especificación Formal de Casos de Uso del Sistema (CU01 - CU05)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">CU01</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Actor: Químico Farmacéutico</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Consultar Inventario Global y Sedes Cercanas (&lt;10km)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Permite buscar un fármaco por nombre/EAN y calcula en milisegundos las 5 sucursales más cercanas con stock disponible dentro de un radio de 10 km usando la fórmula de Haversine.
                </p>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                  ✓ Postcondición: Muestra stock disponible, distancia geodésica y botón de solicitud de traslado.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">CU02</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Actor: Motor Predictivo SIIP</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Generar Alerta Predictiva de Quiebre de Stock</h3>
                <p className="text-slate-600 leading-relaxed">
                  Calcula el Consumo Promedio Diario (CPD) y evalúa si la autonomía de inventario es inferior a 7 días. Dispara propuesta de balanceo entre sedes con sobrestock.
                </p>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                  ✓ Postcondición: Emite alerta crítica y asocia sucursal donante cercana.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">CU03</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Actor: Administrador de CD</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Gestionar y Autorizar Traslado Interno</h3>
                <p className="text-slate-600 leading-relaxed">
                  Revisa la sugerencia del sistema y aprueba con un solo clic la transferencia de cajas desde la farmacia donante hacia la tienda desabastecida.
                </p>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                  ✓ Postcondición: Bloquea stock en tránsito y genera la Guía de Remisión (CU05).
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">CU04</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Actor: QF & CD</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Monitorear Caducidad de Lotes (Semáforo FEFO 90/60/30d)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Monitorea diariamente los lotes farmacéuticos categorizándolos en 3 niveles de alerta (Crítico &lt;30d, Alerta 30-60d, Atención 60-90d) para reducir el 22% de mermas económicas.
                </p>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                  ✓ Postcondición: Prioriza dispensación FEFO y alerta devoluciones a laboratorios.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2: BPMN */}
        {activeSection === 'bpmn' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-emerald-600" />
              2. Diagrama de Proceso de Negocio BPMN 2.0 (Prevención de Quiebre)
            </h2>
            <p className="text-xs text-slate-600">
              Flujo secuencial que describe la trazabilidad entre el punto de venta, los microservicios y la logística física:
            </p>

            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto space-y-2">
              <div className="text-cyan-400 font-bold">1. [Punto de Venta] -&gt; Venta de última caja en ventanilla</div>
              <div className="text-slate-300">2. [ms-inventario] -&gt; Resta de stock y evaluación de umbral mínimo</div>
              <div className="text-amber-400 font-bold">3. [Compuerta Lógica] -&gt; ¿Stock actual &le; Umbral crítico? (Sí)</div>
              <div className="text-slate-300">4. [ms-prediccion] -&gt; Algoritmo geoespacial busca sucursales con sobrestock &lt; 10 km</div>
              <div className="text-cyan-400">5. [Evento Notificación] -&gt; Alerta automática a bandeja del Administrador de CD</div>
              <div className="text-emerald-400 font-bold">6. [Tarea Humana] -&gt; Administrador de CD aprueba el traslado en 1 clic</div>
              <div className="text-white font-bold">7. [Fin del Proceso] -&gt; Emisión de Guía de Remisión con QR y despacho físico</div>
            </div>
          </div>
        )}

        {/* SECTION 3: Arquitectura */}
        {activeSection === 'arquitectura' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600" />
              3. Arquitectura de Microservicios (Spring Boot + React + PostgreSQL)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-blue-800 uppercase">Capa Cliente (Frontend)</span>
                <p className="text-slate-700">Single Page Application (SPA) construida en <strong>React 18 + Vite + Tailwind CSS</strong> para una experiencia reactiva y sin recarga de página.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-purple-800 uppercase">Capa de Servicios (Backend)</span>
                <p className="text-slate-700">Microservicios en <strong>Java Spring Boot</strong> (Inventario, Alertas, Traslados y Seguridad JWT) orquestados con Spring Cloud Gateway.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-emerald-800 uppercase">Capa de Datos</span>
                <p className="text-slate-700">Base de datos relacional <strong>PostgreSQL 16</strong> que garantiza transacciones ACID sobre los lotes y el stock contable.</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Database DER */}
        {activeSection === 'database' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              4. Modelo de Datos Relacional Entidad-Relación (PostgreSQL)
            </h2>
            <p className="text-xs text-slate-600">
              Estructura relacional con claves primarias y foráneas que garantizan la integridad de lotes, sucursales y traslados:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">SUCURSAL</div>
                <div className="text-[11px] text-slate-500 font-mono">id_sucursal (PK), codigo, marca, direccion, latitud, longitud</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">MEDICAMENTO</div>
                <div className="text-[11px] text-slate-500 font-mono">id_medicamento (PK), codigo_ean, nombre, principio_activo, registro_digemid</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">LOTE</div>
                <div className="text-[11px] text-slate-500 font-mono">id_lote (PK), id_medicamento (FK), fecha_vencimiento, cantidad</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">SOLICITUD_TRASLADO</div>
                <div className="text-[11px] text-slate-500 font-mono">id_traslado (PK), id_origen (FK), id_destino (FK), estado, fecha</div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: WBS & Gantt */}
        {activeSection === 'wbs_gantt' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              5. WBS Jerárquico & Cronograma de Gantt (4 Meses)
            </h2>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div className="font-bold text-slate-800 uppercase">Hitos del Proyecto (16 Semanas):</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-blue-900">Mes 1</div>
                  <p className="text-slate-600 mt-1">Levantamiento de información, Project Charter, SRS y diseño de mockups.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-purple-900">Mes 2</div>
                  <p className="text-slate-600 mt-1">Desarrollo de Base de Datos PostgreSQL y Microservicios Spring Boot (50% Java).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-emerald-900">Mes 3</div>
                  <p className="text-slate-600 mt-1">Desarrollo del Frontend React, algoritmo predictivo y semáforo de vencimientos.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-amber-900">Mes 4</div>
                  <p className="text-slate-600 mt-1">Fase de pruebas (testing), plan piloto distrital, capacitación y entrega final.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
