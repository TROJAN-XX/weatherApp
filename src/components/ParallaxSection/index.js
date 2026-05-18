import useMouseParallax from "../../hooks/useMouseParallax";
import "./index.css";

const ParallaxSection = (props) => {
  const { children, strength = 20, className = "" } = props;
  const { x, y } = useMouseParallax(strength);

  return (
    <section
      className={`parallax-section ${className}`}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
    >
      {children}
    </section>
  );
};

export default ParallaxSection;
