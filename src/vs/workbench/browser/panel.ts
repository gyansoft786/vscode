/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import nls = require('vs/nls');
import {Promise} from 'vs/base/common/winjs.base';
import {Action} from 'vs/base/common/actions';
import {Registry} from 'vs/platform/platform';
import {IPanel} from 'vs/workbench/common/panel';
import {Composite, CompositeDescriptor, CompositeRegistry} from 'vs/workbench/browser/composite';
import {IPartService} from 'vs/workbench/services/part/common/partService';

export abstract class Panel extends Composite implements IPanel { }

/**
 * A panel descriptor is a leightweight descriptor of a panel in the monaco workbench.
 */
export class PanelDescriptor extends CompositeDescriptor<Panel> { }

export class PanelRegistry extends CompositeRegistry<Panel> {
	private defaultPanelId: string;

	/**
	 * Registers a panel to the platform.
	 */
	public registerPanel(descriptor: PanelDescriptor): void {
		super.registerComposite(descriptor);
	}

	/**
	 * Returns the panel descriptor for the given id or null if none.
	 */
	public getPanel(id: string): PanelDescriptor {
		return this.getComposite(id);
	}

	/**
	 * Returns an array of registered panels known to the platform.
	 */
	public getPanels(): PanelDescriptor[] {
		return this.getComposits();
	}

	/**
	 * Sets the id of the panel that should open on startup by default.
	 */
	public setDefaultPanelId(id: string): void {
		this.defaultPanelId = id;
	}

	/**
	 * Gets the id of the panel that should open on startup by default.
	 */
	public getDefaultPanelId(): string {
		return this.defaultPanelId;
	}
}

export const Extensions = {
	Panels: 'workbench.contributions.panels'
};

export class ClosePanelAction extends Action {
	static ID = 'workbench.action.closePanelAction';
	static LABEL = nls.localize('closePanel', "Close");

	constructor(
		id: string,
		name: string,
		@IPartService private partService: IPartService
	) {
		super(id, name, 'close-editor-action');
	}

	public run(): Promise {
		this.partService.setPanelHidden(!this.partService.isPanelHidden());
		return Promise.as(true);
	}
}

Registry.add(Extensions.Panels, new PanelRegistry());
