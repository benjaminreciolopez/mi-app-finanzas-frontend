import { useEffect } from "react";
import "./pantallasSwipeables.css";
import Evolucion from "./Evolucion/Evolucion";
import Clientes from "./Clientes/Clientes";
import Calendario from "./Calendario/Calendario";
import Control from "./Control/Control";
import Materiales from "./Materiales/Materiales";
import Pagos from "./Pagos/Pagos";

interface Props {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

function PantallasSwipeables({ scrollRef }: Props) {
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [scrollRef]);

  return (
    <div className="scroll-horizontal" ref={scrollRef}>
      <div className="pantalla">
        <Evolucion />
      </div>
      <div className="pantalla">
        <Clientes />
      </div>
      <div className="pantalla">
        <Calendario />
      </div>
      <div className="pantalla">
        <Control />
      </div>
      <div className="pantalla">
        <Materiales />
      </div>
      <div className="pantalla">
        <Pagos />
      </div>
    </div>
  );
}

export default PantallasSwipeables;
