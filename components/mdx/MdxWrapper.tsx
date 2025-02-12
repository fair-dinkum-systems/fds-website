import { useMDXComponent } from "next-contentlayer/hooks";
import CustomImage from "./Image";

const components = {
  Image: CustomImage,
};

export default function MdxWrapper({ code }: { code: string }) {
  const Component = useMDXComponent(code, { components });

  return <Component components={components} />;
}
