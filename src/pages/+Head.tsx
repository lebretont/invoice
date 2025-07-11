import logoUrl from "../../assets/logo.png";
import '#/renderer/index.css';

export default function HeadDefault() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
    </>
  );
}
