import {Drawer, Button, Label, Select, RangeSlider} from "flowbite-react";
import {useState} from "react";
import {useTheme} from "../hooks";

const fonts = ["Inter", "Roboto", "Poppins", "Montserrat"];
const colors = ["#1D4ED8", "#DC2626", "#10B981", "#F59E0B"];

export const ThemeCustomizer = () => {
    const {theme, setTheme} = useTheme();
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    return (
        <>
            {/* Botón flotante para abrir el Drawer */}
            <Button onClick={() => setOpen(true)} className="fixed bottom-5 left-5 z-50">
                🎨
            </Button>

            {/* Drawer lateral */}
            <Drawer open={open} onClose={handleClose} position="left">
                <Drawer.Header title="🎨 Personalizar Tema" />
                <Drawer.Items>
                    {/* Selector de color base */}
                    <div className="mb-4">
                        <Label>Color Primario</Label>
                        <Select
                            onChange={(e) =>
                                setTheme({
                                    ...theme,
                                    button: {
                                        color: {
                                            primary: `bg-[${e.target.value}] text-white hover:bg-opacity-80`
                                        }
                                    }
                                })
                            }
                        >
                            {colors.map((color) => (
                                <option key={color} value={color} style={{backgroundColor: color}}>
                                    {color}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Selector de fuente */}
                    <div className="mb-4">
                        <Label>Fuente</Label>
                        <Select
                            onChange={() =>
                                setTheme({
                                    ...theme,
                                    card: {
                                        root:{
                                            base: "text-xl font-semibold italic text-gray-900 dark:text-white"
                                        }
                                    }
                                })
                            }
                        >
                            {fonts.map((font) => (
                                <option key={font} value={font}>
                                    {font}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Selector de tamaño de fuente */}
                    <div className="mb-4">
                        <Label>Tamaño de Fuente</Label>
                        <RangeSlider
                            min={12}
                            max={24}
                            step={2}
                            defaultValue={16}
                            onChange={(e) =>
                                document.documentElement.style.setProperty("--font-size", `${e.target.value}px`)
                            }
                        />
                    </div>

                </Drawer.Items>
            </Drawer>
        </>
    );
};
