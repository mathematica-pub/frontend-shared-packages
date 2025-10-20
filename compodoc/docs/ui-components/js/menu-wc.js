'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Frontend Shared Packages Documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#additional-pages"'
                            : 'data-bs-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>more READMEs</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/data-marks.html" data-type="entity-link" data-context-id="additional">Data Marks</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/using-the-library.html" data-type="entity-link" data-context-id="additional">Using the library</a>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/HsiUiComboboxModule.html" data-type="entity-link" >HsiUiComboboxModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HsiUiComboboxModule-9baa0c0467ab0babd1ad2eb6c57bbea7a4da754470a54cc9c6b98fa89791ef8dca611c829e26476bcedaba35b72b13c3a29271b801b64c093cf2d5aecb9609e2"' : 'data-bs-target="#xs-components-links-module-HsiUiComboboxModule-9baa0c0467ab0babd1ad2eb6c57bbea7a4da754470a54cc9c6b98fa89791ef8dca611c829e26476bcedaba35b72b13c3a29271b801b64c093cf2d5aecb9609e2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HsiUiComboboxModule-9baa0c0467ab0babd1ad2eb6c57bbea7a4da754470a54cc9c6b98fa89791ef8dca611c829e26476bcedaba35b72b13c3a29271b801b64c093cf2d5aecb9609e2"' :
                                            'id="xs-components-links-module-HsiUiComboboxModule-9baa0c0467ab0babd1ad2eb6c57bbea7a4da754470a54cc9c6b98fa89791ef8dca611c829e26476bcedaba35b72b13c3a29271b801b64c093cf2d5aecb9609e2"' }>
                                            <li class="link">
                                                <a href="components/ComboboxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ComboboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ComboboxLabelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ComboboxLabelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditableTextboxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditableTextboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListboxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListboxGroupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListboxGroupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListboxLabelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListboxLabelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListboxOptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListboxOptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectAllListboxOptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelectAllListboxOptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextboxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TextboxComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TableModule.html" data-type="entity-link" >TableModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TableModule-80222d71fab18c049dc84d989eb2c8b27d508d6dd6908e88307e5df37bfef7356c1d917b7516541232db91e69ac363f85d5f2b3e015bd25523f877670fac1509"' : 'data-bs-target="#xs-components-links-module-TableModule-80222d71fab18c049dc84d989eb2c8b27d508d6dd6908e88307e5df37bfef7356c1d917b7516541232db91e69ac363f85d5f2b3e015bd25523f877670fac1509"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TableModule-80222d71fab18c049dc84d989eb2c8b27d508d6dd6908e88307e5df37bfef7356c1d917b7516541232db91e69ac363f85d5f2b3e015bd25523f877670fac1509"' :
                                            'id="xs-components-links-module-TableModule-80222d71fab18c049dc84d989eb2c8b27d508d6dd6908e88307e5df37bfef7356c1d917b7516541232db91e69ac363f85d5f2b3e015bd25523f877670fac1509"' }>
                                            <li class="link">
                                                <a href="components/SingleSortHeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SingleSortHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsModule.html" data-type="entity-link" >TabsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TabsModule-bddb4525f253b8f237fe03ad28c1c46e5cf0d3949cbdb5df2d61d5cab1b1a35b1c7a32054c87d7b9aef885f3492601b59d7130b853025a8713e42a478f7e7f95"' : 'data-bs-target="#xs-components-links-module-TabsModule-bddb4525f253b8f237fe03ad28c1c46e5cf0d3949cbdb5df2d61d5cab1b1a35b1c7a32054c87d7b9aef885f3492601b59d7130b853025a8713e42a478f7e7f95"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TabsModule-bddb4525f253b8f237fe03ad28c1c46e5cf0d3949cbdb5df2d61d5cab1b1a35b1c7a32054c87d7b9aef885f3492601b59d7130b853025a8713e42a478f7e7f95"' :
                                            'id="xs-components-links-module-TabsModule-bddb4525f253b8f237fe03ad28c1c46e5cf0d3949cbdb5df2d61d5cab1b1a35b1c7a32054c87d7b9aef885f3492601b59d7130b853025a8713e42a478f7e7f95"' }>
                                            <li class="link">
                                                <a href="components/TabBodyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabBodyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabLabelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabLabelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-TabsModule-bddb4525f253b8f237fe03ad28c1c46e5cf0d3949cbdb5df2d61d5cab1b1a35b1c7a32054c87d7b9aef885f3492601b59d7130b853025a8713e42a478f7e7f95"' : 'data-bs-target="#xs-directives-links-module-TabsModule-bddb4525f253b8f237fe03ad28c1c46e5cf0d3949cbdb5df2d61d5cab1b1a35b1c7a32054c87d7b9aef885f3492601b59d7130b853025a8713e42a478f7e7f95"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-TabsModule-bddb4525f253b8f237fe03ad28c1c46e5cf0d3949cbdb5df2d61d5cab1b1a35b1c7a32054c87d7b9aef885f3492601b59d7130b853025a8713e42a478f7e7f95"' :
                                        'id="xs-directives-links-module-TabsModule-bddb4525f253b8f237fe03ad28c1c46e5cf0d3949cbdb5df2d61d5cab1b1a35b1c7a32054c87d7b9aef885f3492601b59d7130b853025a8713e42a478f7e7f95"' }>
                                        <li class="link">
                                            <a href="directives/TabContentDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabContentDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ComboboxComponent.html" data-type="entity-link" >ComboboxComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ComboboxLabelComponent.html" data-type="entity-link" >ComboboxLabelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditableTextboxComponent.html" data-type="entity-link" >EditableTextboxComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HsiUiDirectoryComponent.html" data-type="entity-link" >HsiUiDirectoryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListboxComponent.html" data-type="entity-link" >ListboxComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListboxGroupComponent.html" data-type="entity-link" >ListboxGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListboxLabelComponent.html" data-type="entity-link" >ListboxLabelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListboxOptionComponent.html" data-type="entity-link" >ListboxOptionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SelectAllListboxOptionComponent.html" data-type="entity-link" >SelectAllListboxOptionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TabBodyComponent.html" data-type="entity-link" >TabBodyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TabItemComponent.html" data-type="entity-link" >TabItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TabLabelComponent.html" data-type="entity-link" >TabLabelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TabsComponent.html" data-type="entity-link" >TabsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TextboxComponent.html" data-type="entity-link" >TextboxComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/TabContentDirective.html" data-type="entity-link" >TabContentDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ComboboxBaseTestComponent.html" data-type="entity-link" >ComboboxBaseTestComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ComboboxMainServiceStub.html" data-type="entity-link" >ComboboxMainServiceStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/ComboboxServiceStub.html" data-type="entity-link" >ComboboxServiceStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/HsiUiTableConfig.html" data-type="entity-link" >HsiUiTableConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListboxFilteringServiceStub.html" data-type="entity-link" >ListboxFilteringServiceStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListboxScrollServiceStub.html" data-type="entity-link" >ListboxScrollServiceStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableColumn.html" data-type="entity-link" >TableColumn</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ActiveIndexService.html" data-type="entity-link" >ActiveIndexService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ComboboxService.html" data-type="entity-link" >ComboboxService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ListboxFilteringService.html" data-type="entity-link" >ListboxFilteringService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ListboxScrollService.html" data-type="entity-link" >ListboxScrollService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TabsService.html" data-type="entity-link" >TabsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/HsiUiDirectoryItem.html" data-type="entity-link" >HsiUiDirectoryItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HsiUiDirectorySelection.html" data-type="entity-link" >HsiUiDirectorySelection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/KeyboardEventWithAutocomplete.html" data-type="entity-link" >KeyboardEventWithAutocomplete</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListboxOptionPropertyChange.html" data-type="entity-link" >ListboxOptionPropertyChange</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});