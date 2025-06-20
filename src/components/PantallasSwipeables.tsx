import { useEffect } from "react";
import "./pantallasSwipeables.css";

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
        <h2>Evolución</h2>
      </div>
      <div className="pantalla">
        <h2>Clientes</h2>
      </div>
      <div className="pantalla">
        <h2>Calendario</h2>
      </div>
      <div className="pantalla">
        <h2>Control</h2>
      </div>
      <div className="pantalla">
        <h2>Materiales</h2>
      </div>
      <div className="pantalla">
        <h2>Pagos</h2>
      </div>
    </div>
  );
}

export default PantallasSwipeables;
