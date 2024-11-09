import { useCompanySelector } from "./useCompanySelector";

const useTheme = () => {
  const { company } = useCompanySelector();

  const setTheme = () => {
    document.documentElement.style.setProperty(
      "--primary-color",
      company?.brand?.primary_color
    );

    document.documentElement.style.setProperty(
      "--secondary-color",
      company?.brand?.secondary_color
    );
  };
 
  return {
    setTheme,
  };
};

export default useTheme;
