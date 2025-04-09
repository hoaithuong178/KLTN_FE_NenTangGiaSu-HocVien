import { ReactElement } from 'react';
import { createPortal } from 'react-dom';

const createPortalWrapper = () => {
    const element = document.createElement('div');
    element.id = 'portal-wrapper';

    return element;
};

const portalWrapper = createPortalWrapper();
document.body.appendChild(portalWrapper);

const Portal = ({ children }: { children: ReactElement }) => {
    return createPortal(children, portalWrapper);
};

export default Portal;
