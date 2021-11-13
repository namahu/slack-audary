import { Properties } from "./audary";

const getProperties_ = (): [GoogleAppsScript.Properties.Properties, Properties] => {
    const scriptProperty = PropertiesService.getScriptProperties();
    const properties = scriptProperty.getProperties() as unknown as Properties;

    return [ scriptProperty, properties ];
};

const checkProperty = () => {
    const [ _, properties ] = getProperties_();
    Logger.log(properties);
};

const setProperty = () => {
    const [ scriptProperty, properties ] = getProperties_();
    scriptProperty.setProperty("key", "value");
};
