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
                                <a href="modules/VicBarsModule.html" data-type="entity-link" >VicBarsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicBarsModule-0b6d9b1558f525ea3838a82d0b0276846582fee2cd9724bdd0e2d4a84f08d863e4c75b1cdd7e4ec64a9273eed5031e85246902231b0eb0ce630d505857dd17c7"' : 'data-bs-target="#xs-components-links-module-VicBarsModule-0b6d9b1558f525ea3838a82d0b0276846582fee2cd9724bdd0e2d4a84f08d863e4c75b1cdd7e4ec64a9273eed5031e85246902231b0eb0ce630d505857dd17c7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicBarsModule-0b6d9b1558f525ea3838a82d0b0276846582fee2cd9724bdd0e2d4a84f08d863e4c75b1cdd7e4ec64a9273eed5031e85246902231b0eb0ce630d505857dd17c7"' :
                                            'id="xs-components-links-module-VicBarsModule-0b6d9b1558f525ea3838a82d0b0276846582fee2cd9724bdd0e2d4a84f08d863e4c75b1cdd7e4ec64a9273eed5031e85246902231b0eb0ce630d505857dd17c7"' }>
                                            <li class="link">
                                                <a href="components/BarsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BarsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-VicBarsModule-0b6d9b1558f525ea3838a82d0b0276846582fee2cd9724bdd0e2d4a84f08d863e4c75b1cdd7e4ec64a9273eed5031e85246902231b0eb0ce630d505857dd17c7"' : 'data-bs-target="#xs-directives-links-module-VicBarsModule-0b6d9b1558f525ea3838a82d0b0276846582fee2cd9724bdd0e2d4a84f08d863e4c75b1cdd7e4ec64a9273eed5031e85246902231b0eb0ce630d505857dd17c7"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-VicBarsModule-0b6d9b1558f525ea3838a82d0b0276846582fee2cd9724bdd0e2d4a84f08d863e4c75b1cdd7e4ec64a9273eed5031e85246902231b0eb0ce630d505857dd17c7"' :
                                        'id="xs-directives-links-module-VicBarsModule-0b6d9b1558f525ea3838a82d0b0276846582fee2cd9724bdd0e2d4a84f08d863e4c75b1cdd7e4ec64a9273eed5031e85246902231b0eb0ce630d505857dd17c7"' }>
                                        <li class="link">
                                            <a href="directives/BarsEventsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BarsEventsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicChartModule.html" data-type="entity-link" >VicChartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicChartModule-2fa12009fd6d869213a5e163b8f3420408f1fe51103b0685b0ee7532364ea73a4dacf9e8f6b6f7d0532e95248fb88948407315013e0f0edf7efe2874d83cd1d5"' : 'data-bs-target="#xs-components-links-module-VicChartModule-2fa12009fd6d869213a5e163b8f3420408f1fe51103b0685b0ee7532364ea73a4dacf9e8f6b6f7d0532e95248fb88948407315013e0f0edf7efe2874d83cd1d5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicChartModule-2fa12009fd6d869213a5e163b8f3420408f1fe51103b0685b0ee7532364ea73a4dacf9e8f6b6f7d0532e95248fb88948407315013e0f0edf7efe2874d83cd1d5"' :
                                            'id="xs-components-links-module-VicChartModule-2fa12009fd6d869213a5e163b8f3420408f1fe51103b0685b0ee7532364ea73a4dacf9e8f6b6f7d0532e95248fb88948407315013e0f0edf7efe2874d83cd1d5"' }>
                                            <li class="link">
                                                <a href="components/ChartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapChartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapChartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/XyChartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >XyChartComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicDotsModule.html" data-type="entity-link" >VicDotsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicDotsModule-c0129d7476ca64a6d688c50b03b06a59d457462b9e9b6578a97ab1e751cdd955f046b1d08c0c2472634bf18d88c2a54dddcdbc2dc19b3ec89dbd601044c7e633"' : 'data-bs-target="#xs-components-links-module-VicDotsModule-c0129d7476ca64a6d688c50b03b06a59d457462b9e9b6578a97ab1e751cdd955f046b1d08c0c2472634bf18d88c2a54dddcdbc2dc19b3ec89dbd601044c7e633"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicDotsModule-c0129d7476ca64a6d688c50b03b06a59d457462b9e9b6578a97ab1e751cdd955f046b1d08c0c2472634bf18d88c2a54dddcdbc2dc19b3ec89dbd601044c7e633"' :
                                            'id="xs-components-links-module-VicDotsModule-c0129d7476ca64a6d688c50b03b06a59d457462b9e9b6578a97ab1e751cdd955f046b1d08c0c2472634bf18d88c2a54dddcdbc2dc19b3ec89dbd601044c7e633"' }>
                                            <li class="link">
                                                <a href="components/DotsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DotsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-VicDotsModule-c0129d7476ca64a6d688c50b03b06a59d457462b9e9b6578a97ab1e751cdd955f046b1d08c0c2472634bf18d88c2a54dddcdbc2dc19b3ec89dbd601044c7e633"' : 'data-bs-target="#xs-directives-links-module-VicDotsModule-c0129d7476ca64a6d688c50b03b06a59d457462b9e9b6578a97ab1e751cdd955f046b1d08c0c2472634bf18d88c2a54dddcdbc2dc19b3ec89dbd601044c7e633"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-VicDotsModule-c0129d7476ca64a6d688c50b03b06a59d457462b9e9b6578a97ab1e751cdd955f046b1d08c0c2472634bf18d88c2a54dddcdbc2dc19b3ec89dbd601044c7e633"' :
                                        'id="xs-directives-links-module-VicDotsModule-c0129d7476ca64a6d688c50b03b06a59d457462b9e9b6578a97ab1e751cdd955f046b1d08c0c2472634bf18d88c2a54dddcdbc2dc19b3ec89dbd601044c7e633"' }>
                                        <li class="link">
                                            <a href="directives/DotsEventsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DotsEventsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicGeographiesModule.html" data-type="entity-link" >VicGeographiesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicGeographiesModule-52403ced5c66d9c4111521d8c1745a05f2ed88dc6281a3f4d3948c8371fca71992baba4eb18af7bb67ea29eae57b661fe3900e0eca5038dccb9e69754882314f"' : 'data-bs-target="#xs-components-links-module-VicGeographiesModule-52403ced5c66d9c4111521d8c1745a05f2ed88dc6281a3f4d3948c8371fca71992baba4eb18af7bb67ea29eae57b661fe3900e0eca5038dccb9e69754882314f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicGeographiesModule-52403ced5c66d9c4111521d8c1745a05f2ed88dc6281a3f4d3948c8371fca71992baba4eb18af7bb67ea29eae57b661fe3900e0eca5038dccb9e69754882314f"' :
                                            'id="xs-components-links-module-VicGeographiesModule-52403ced5c66d9c4111521d8c1745a05f2ed88dc6281a3f4d3948c8371fca71992baba4eb18af7bb67ea29eae57b661fe3900e0eca5038dccb9e69754882314f"' }>
                                            <li class="link">
                                                <a href="components/GeographiesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GeographiesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-VicGeographiesModule-52403ced5c66d9c4111521d8c1745a05f2ed88dc6281a3f4d3948c8371fca71992baba4eb18af7bb67ea29eae57b661fe3900e0eca5038dccb9e69754882314f"' : 'data-bs-target="#xs-directives-links-module-VicGeographiesModule-52403ced5c66d9c4111521d8c1745a05f2ed88dc6281a3f4d3948c8371fca71992baba4eb18af7bb67ea29eae57b661fe3900e0eca5038dccb9e69754882314f"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-VicGeographiesModule-52403ced5c66d9c4111521d8c1745a05f2ed88dc6281a3f4d3948c8371fca71992baba4eb18af7bb67ea29eae57b661fe3900e0eca5038dccb9e69754882314f"' :
                                        'id="xs-directives-links-module-VicGeographiesModule-52403ced5c66d9c4111521d8c1745a05f2ed88dc6281a3f4d3948c8371fca71992baba4eb18af7bb67ea29eae57b661fe3900e0eca5038dccb9e69754882314f"' }>
                                        <li class="link">
                                            <a href="directives/GeographiesEventsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GeographiesEventsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicGroupedBarsModule.html" data-type="entity-link" >VicGroupedBarsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicGroupedBarsModule-c9d24a3f3934b6fc06a17f2b6165dd0b8b7901406d1ea48e4863c14b72d4e03344550e9d13e2aa297516969c440f9843518347cf5b51f67cbb806292629637a6"' : 'data-bs-target="#xs-components-links-module-VicGroupedBarsModule-c9d24a3f3934b6fc06a17f2b6165dd0b8b7901406d1ea48e4863c14b72d4e03344550e9d13e2aa297516969c440f9843518347cf5b51f67cbb806292629637a6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicGroupedBarsModule-c9d24a3f3934b6fc06a17f2b6165dd0b8b7901406d1ea48e4863c14b72d4e03344550e9d13e2aa297516969c440f9843518347cf5b51f67cbb806292629637a6"' :
                                            'id="xs-components-links-module-VicGroupedBarsModule-c9d24a3f3934b6fc06a17f2b6165dd0b8b7901406d1ea48e4863c14b72d4e03344550e9d13e2aa297516969c440f9843518347cf5b51f67cbb806292629637a6"' }>
                                            <li class="link">
                                                <a href="components/GroupedBarsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupedBarsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-VicGroupedBarsModule-c9d24a3f3934b6fc06a17f2b6165dd0b8b7901406d1ea48e4863c14b72d4e03344550e9d13e2aa297516969c440f9843518347cf5b51f67cbb806292629637a6"' : 'data-bs-target="#xs-directives-links-module-VicGroupedBarsModule-c9d24a3f3934b6fc06a17f2b6165dd0b8b7901406d1ea48e4863c14b72d4e03344550e9d13e2aa297516969c440f9843518347cf5b51f67cbb806292629637a6"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-VicGroupedBarsModule-c9d24a3f3934b6fc06a17f2b6165dd0b8b7901406d1ea48e4863c14b72d4e03344550e9d13e2aa297516969c440f9843518347cf5b51f67cbb806292629637a6"' :
                                        'id="xs-directives-links-module-VicGroupedBarsModule-c9d24a3f3934b6fc06a17f2b6165dd0b8b7901406d1ea48e4863c14b72d4e03344550e9d13e2aa297516969c440f9843518347cf5b51f67cbb806292629637a6"' }>
                                        <li class="link">
                                            <a href="directives/GroupedBarsEventsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupedBarsEventsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicHtmlTooltipModule.html" data-type="entity-link" >VicHtmlTooltipModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicHtmlTooltipModule-55ef2987157ef7d013f9e50876a5bd0119cf9584bb45cbc88325d0ae0b9d5b238b104560c8223915a16cd952d0f97fe1cb8844cbf5881e7325b3a4c6a824396b"' : 'data-bs-target="#xs-components-links-module-VicHtmlTooltipModule-55ef2987157ef7d013f9e50876a5bd0119cf9584bb45cbc88325d0ae0b9d5b238b104560c8223915a16cd952d0f97fe1cb8844cbf5881e7325b3a4c6a824396b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicHtmlTooltipModule-55ef2987157ef7d013f9e50876a5bd0119cf9584bb45cbc88325d0ae0b9d5b238b104560c8223915a16cd952d0f97fe1cb8844cbf5881e7325b3a4c6a824396b"' :
                                            'id="xs-components-links-module-VicHtmlTooltipModule-55ef2987157ef7d013f9e50876a5bd0119cf9584bb45cbc88325d0ae0b9d5b238b104560c8223915a16cd952d0f97fe1cb8844cbf5881e7325b3a4c6a824396b"' }>
                                            <li class="link">
                                                <a href="components/TooltipTriangleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TooltipTriangleComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-VicHtmlTooltipModule-55ef2987157ef7d013f9e50876a5bd0119cf9584bb45cbc88325d0ae0b9d5b238b104560c8223915a16cd952d0f97fe1cb8844cbf5881e7325b3a4c6a824396b"' : 'data-bs-target="#xs-directives-links-module-VicHtmlTooltipModule-55ef2987157ef7d013f9e50876a5bd0119cf9584bb45cbc88325d0ae0b9d5b238b104560c8223915a16cd952d0f97fe1cb8844cbf5881e7325b3a4c6a824396b"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-VicHtmlTooltipModule-55ef2987157ef7d013f9e50876a5bd0119cf9584bb45cbc88325d0ae0b9d5b238b104560c8223915a16cd952d0f97fe1cb8844cbf5881e7325b3a4c6a824396b"' :
                                        'id="xs-directives-links-module-VicHtmlTooltipModule-55ef2987157ef7d013f9e50876a5bd0119cf9584bb45cbc88325d0ae0b9d5b238b104560c8223915a16cd952d0f97fe1cb8844cbf5881e7325b3a4c6a824396b"' }>
                                        <li class="link">
                                            <a href="directives/HtmlTooltipDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HtmlTooltipDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicLinesModule.html" data-type="entity-link" >VicLinesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicLinesModule-a7e76457725b1a913f6f22411ff4fff503a0d9a8fe9d246f464177d89bd035f2c6134087925dc7ef6b685b7cd8b212c08c3916ae15e3c4b91adb9b3b1b6a7955"' : 'data-bs-target="#xs-components-links-module-VicLinesModule-a7e76457725b1a913f6f22411ff4fff503a0d9a8fe9d246f464177d89bd035f2c6134087925dc7ef6b685b7cd8b212c08c3916ae15e3c4b91adb9b3b1b6a7955"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicLinesModule-a7e76457725b1a913f6f22411ff4fff503a0d9a8fe9d246f464177d89bd035f2c6134087925dc7ef6b685b7cd8b212c08c3916ae15e3c4b91adb9b3b1b6a7955"' :
                                            'id="xs-components-links-module-VicLinesModule-a7e76457725b1a913f6f22411ff4fff503a0d9a8fe9d246f464177d89bd035f2c6134087925dc7ef6b685b7cd8b212c08c3916ae15e3c4b91adb9b3b1b6a7955"' }>
                                            <li class="link">
                                                <a href="components/LinesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LinesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-VicLinesModule-a7e76457725b1a913f6f22411ff4fff503a0d9a8fe9d246f464177d89bd035f2c6134087925dc7ef6b685b7cd8b212c08c3916ae15e3c4b91adb9b3b1b6a7955"' : 'data-bs-target="#xs-directives-links-module-VicLinesModule-a7e76457725b1a913f6f22411ff4fff503a0d9a8fe9d246f464177d89bd035f2c6134087925dc7ef6b685b7cd8b212c08c3916ae15e3c4b91adb9b3b1b6a7955"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-VicLinesModule-a7e76457725b1a913f6f22411ff4fff503a0d9a8fe9d246f464177d89bd035f2c6134087925dc7ef6b685b7cd8b212c08c3916ae15e3c4b91adb9b3b1b6a7955"' :
                                        'id="xs-directives-links-module-VicLinesModule-a7e76457725b1a913f6f22411ff4fff503a0d9a8fe9d246f464177d89bd035f2c6134087925dc7ef6b685b7cd8b212c08c3916ae15e3c4b91adb9b3b1b6a7955"' }>
                                        <li class="link">
                                            <a href="directives/LinesEventsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LinesEventsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicMapLegendModule.html" data-type="entity-link" >VicMapLegendModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicMapLegendModule-9a3c88f4f863ecde3784579217f943031701db0cc61f325d818e73185fb48d5d2ff66a84e82520e83d83e9af48dc6ee42f88f288f0bb494194643d60f0c25160"' : 'data-bs-target="#xs-components-links-module-VicMapLegendModule-9a3c88f4f863ecde3784579217f943031701db0cc61f325d818e73185fb48d5d2ff66a84e82520e83d83e9af48dc6ee42f88f288f0bb494194643d60f0c25160"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicMapLegendModule-9a3c88f4f863ecde3784579217f943031701db0cc61f325d818e73185fb48d5d2ff66a84e82520e83d83e9af48dc6ee42f88f288f0bb494194643d60f0c25160"' :
                                            'id="xs-components-links-module-VicMapLegendModule-9a3c88f4f863ecde3784579217f943031701db0cc61f325d818e73185fb48d5d2ff66a84e82520e83d83e9af48dc6ee42f88f288f0bb494194643d60f0c25160"' }>
                                            <li class="link">
                                                <a href="components/MapLegendComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapLegendComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicQuantitativeRulesModule.html" data-type="entity-link" >VicQuantitativeRulesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicQuantitativeRulesModule-a05d3886e8e19a3e57b08623ca61e0ed0082e9499abfbc3d382cd4348cc7b3bcf419e6db02c0333e13948782f06a8c35391e0290ccdd7f6d138929bd3720005e"' : 'data-bs-target="#xs-components-links-module-VicQuantitativeRulesModule-a05d3886e8e19a3e57b08623ca61e0ed0082e9499abfbc3d382cd4348cc7b3bcf419e6db02c0333e13948782f06a8c35391e0290ccdd7f6d138929bd3720005e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicQuantitativeRulesModule-a05d3886e8e19a3e57b08623ca61e0ed0082e9499abfbc3d382cd4348cc7b3bcf419e6db02c0333e13948782f06a8c35391e0290ccdd7f6d138929bd3720005e"' :
                                            'id="xs-components-links-module-VicQuantitativeRulesModule-a05d3886e8e19a3e57b08623ca61e0ed0082e9499abfbc3d382cd4348cc7b3bcf419e6db02c0333e13948782f06a8c35391e0290ccdd7f6d138929bd3720005e"' }>
                                            <li class="link">
                                                <a href="components/QuantitativeRulesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuantitativeRulesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicStackedAreaModule.html" data-type="entity-link" >VicStackedAreaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicStackedAreaModule-8db6ae06a4154a872eeed0bcf8a78bcbbe1e2888d7de21997b2a68a89abe9f09cfe62634bd3c8ea56be0fb86367caae1643eb2e5c7e9aea826c82984c17bdc8c"' : 'data-bs-target="#xs-components-links-module-VicStackedAreaModule-8db6ae06a4154a872eeed0bcf8a78bcbbe1e2888d7de21997b2a68a89abe9f09cfe62634bd3c8ea56be0fb86367caae1643eb2e5c7e9aea826c82984c17bdc8c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicStackedAreaModule-8db6ae06a4154a872eeed0bcf8a78bcbbe1e2888d7de21997b2a68a89abe9f09cfe62634bd3c8ea56be0fb86367caae1643eb2e5c7e9aea826c82984c17bdc8c"' :
                                            'id="xs-components-links-module-VicStackedAreaModule-8db6ae06a4154a872eeed0bcf8a78bcbbe1e2888d7de21997b2a68a89abe9f09cfe62634bd3c8ea56be0fb86367caae1643eb2e5c7e9aea826c82984c17bdc8c"' }>
                                            <li class="link">
                                                <a href="components/StackedAreaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StackedAreaComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-VicStackedAreaModule-8db6ae06a4154a872eeed0bcf8a78bcbbe1e2888d7de21997b2a68a89abe9f09cfe62634bd3c8ea56be0fb86367caae1643eb2e5c7e9aea826c82984c17bdc8c"' : 'data-bs-target="#xs-directives-links-module-VicStackedAreaModule-8db6ae06a4154a872eeed0bcf8a78bcbbe1e2888d7de21997b2a68a89abe9f09cfe62634bd3c8ea56be0fb86367caae1643eb2e5c7e9aea826c82984c17bdc8c"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-VicStackedAreaModule-8db6ae06a4154a872eeed0bcf8a78bcbbe1e2888d7de21997b2a68a89abe9f09cfe62634bd3c8ea56be0fb86367caae1643eb2e5c7e9aea826c82984c17bdc8c"' :
                                        'id="xs-directives-links-module-VicStackedAreaModule-8db6ae06a4154a872eeed0bcf8a78bcbbe1e2888d7de21997b2a68a89abe9f09cfe62634bd3c8ea56be0fb86367caae1643eb2e5c7e9aea826c82984c17bdc8c"' }>
                                        <li class="link">
                                            <a href="directives/StackedAreaEventsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StackedAreaEventsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicStackedBarsModule.html" data-type="entity-link" >VicStackedBarsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicStackedBarsModule-fac1b6f8e389f6db8eec14d9cfc420a2cc78f3cfd76bcfcd4ed74869811f4c7438139c6d5cebacef61be620c0cca06c31664d7aea1c6a3ac8c5d7e5e676f3b75"' : 'data-bs-target="#xs-components-links-module-VicStackedBarsModule-fac1b6f8e389f6db8eec14d9cfc420a2cc78f3cfd76bcfcd4ed74869811f4c7438139c6d5cebacef61be620c0cca06c31664d7aea1c6a3ac8c5d7e5e676f3b75"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicStackedBarsModule-fac1b6f8e389f6db8eec14d9cfc420a2cc78f3cfd76bcfcd4ed74869811f4c7438139c6d5cebacef61be620c0cca06c31664d7aea1c6a3ac8c5d7e5e676f3b75"' :
                                            'id="xs-components-links-module-VicStackedBarsModule-fac1b6f8e389f6db8eec14d9cfc420a2cc78f3cfd76bcfcd4ed74869811f4c7438139c6d5cebacef61be620c0cca06c31664d7aea1c6a3ac8c5d7e5e676f3b75"' }>
                                            <li class="link">
                                                <a href="components/StackedBarsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StackedBarsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-VicStackedBarsModule-fac1b6f8e389f6db8eec14d9cfc420a2cc78f3cfd76bcfcd4ed74869811f4c7438139c6d5cebacef61be620c0cca06c31664d7aea1c6a3ac8c5d7e5e676f3b75"' : 'data-bs-target="#xs-directives-links-module-VicStackedBarsModule-fac1b6f8e389f6db8eec14d9cfc420a2cc78f3cfd76bcfcd4ed74869811f4c7438139c6d5cebacef61be620c0cca06c31664d7aea1c6a3ac8c5d7e5e676f3b75"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-VicStackedBarsModule-fac1b6f8e389f6db8eec14d9cfc420a2cc78f3cfd76bcfcd4ed74869811f4c7438139c6d5cebacef61be620c0cca06c31664d7aea1c6a3ac8c5d7e5e676f3b75"' :
                                        'id="xs-directives-links-module-VicStackedBarsModule-fac1b6f8e389f6db8eec14d9cfc420a2cc78f3cfd76bcfcd4ed74869811f4c7438139c6d5cebacef61be620c0cca06c31664d7aea1c6a3ac8c5d7e5e676f3b75"' }>
                                        <li class="link">
                                            <a href="directives/StackedBarsEventsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StackedBarsEventsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicXyAxisModule.html" data-type="entity-link" >VicXyAxisModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicXyAxisModule-f12858f00fb7499d886dd5653c5fad92eff0c6821297b9419d08114f06ff5057678ea767d340ac8c3fa5d03bff5ee4c32e8165aa7991034036e76c898956ae95"' : 'data-bs-target="#xs-components-links-module-VicXyAxisModule-f12858f00fb7499d886dd5653c5fad92eff0c6821297b9419d08114f06ff5057678ea767d340ac8c3fa5d03bff5ee4c32e8165aa7991034036e76c898956ae95"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicXyAxisModule-f12858f00fb7499d886dd5653c5fad92eff0c6821297b9419d08114f06ff5057678ea767d340ac8c3fa5d03bff5ee4c32e8165aa7991034036e76c898956ae95"' :
                                            'id="xs-components-links-module-VicXyAxisModule-f12858f00fb7499d886dd5653c5fad92eff0c6821297b9419d08114f06ff5057678ea767d340ac8c3fa5d03bff5ee4c32e8165aa7991034036e76c898956ae95"' }>
                                            <li class="link">
                                                <a href="components/XOrdinalAxisComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >XOrdinalAxisComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/XQuantitativeAxisComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >XQuantitativeAxisComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/YOrdinalAxisComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >YOrdinalAxisComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/YQuantitativeAxisComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >YQuantitativeAxisComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VicXyBackgroundModule.html" data-type="entity-link" >VicXyBackgroundModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VicXyBackgroundModule-bd538c8222c3686d64e09e9ad4532aebaed4c89dd6f55919494dee48fe5f9199403558d3417d374238cb4138ff3aefada7df1fb0fc0216cee575d1e3cd043a11"' : 'data-bs-target="#xs-components-links-module-VicXyBackgroundModule-bd538c8222c3686d64e09e9ad4532aebaed4c89dd6f55919494dee48fe5f9199403558d3417d374238cb4138ff3aefada7df1fb0fc0216cee575d1e3cd043a11"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VicXyBackgroundModule-bd538c8222c3686d64e09e9ad4532aebaed4c89dd6f55919494dee48fe5f9199403558d3417d374238cb4138ff3aefada7df1fb0fc0216cee575d1e3cd043a11"' :
                                            'id="xs-components-links-module-VicXyBackgroundModule-bd538c8222c3686d64e09e9ad4532aebaed4c89dd6f55919494dee48fe5f9199403558d3417d374238cb4138ff3aefada7df1fb0fc0216cee575d1e3cd043a11"' }>
                                            <li class="link">
                                                <a href="components/XyBackgroundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >XyBackgroundComponent</a>
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
                                <a href="components/BarsComponent.html" data-type="entity-link" >BarsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChartComponent.html" data-type="entity-link" >ChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContinuousLegendComponent.html" data-type="entity-link" >ContinuousLegendComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DiscontinuousLegendComponent.html" data-type="entity-link" >DiscontinuousLegendComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DotsComponent.html" data-type="entity-link" >DotsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GeographiesComponent.html" data-type="entity-link" >GeographiesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupedBarsComponent.html" data-type="entity-link" >GroupedBarsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LinesComponent.html" data-type="entity-link" >LinesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MapChartComponent.html" data-type="entity-link" >MapChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MapLegendComponent.html" data-type="entity-link" >MapLegendComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/QuantitativeRulesComponent.html" data-type="entity-link" >QuantitativeRulesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StackedAreaComponent.html" data-type="entity-link" >StackedAreaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StackedBarsComponent.html" data-type="entity-link" >StackedBarsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TooltipTriangleComponent.html" data-type="entity-link" >TooltipTriangleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/XOrdinalAxisComponent.html" data-type="entity-link" >XOrdinalAxisComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/XQuantitativeAxisComponent.html" data-type="entity-link" >XQuantitativeAxisComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/XyBackgroundComponent.html" data-type="entity-link" >XyBackgroundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/XyChartComponent.html" data-type="entity-link" >XyChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/YOrdinalAxisComponent.html" data-type="entity-link" >YOrdinalAxisComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/YQuantitativeAxisComponent.html" data-type="entity-link" >YQuantitativeAxisComponent</a>
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
                                    <a href="directives/AuxMarks.html" data-type="entity-link" >AuxMarks</a>
                                </li>
                                <li class="link">
                                    <a href="directives/BarsEventsDirective.html" data-type="entity-link" >BarsEventsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/DotsEventsDirective.html" data-type="entity-link" >DotsEventsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/EventsDirective.html" data-type="entity-link" >EventsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/GeographiesEventsDirective.html" data-type="entity-link" >GeographiesEventsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/GroupedBarsEventsDirective.html" data-type="entity-link" >GroupedBarsEventsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/HtmlTooltipDirective.html" data-type="entity-link" >HtmlTooltipDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/LinesEventsDirective.html" data-type="entity-link" >LinesEventsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/MapLegend.html" data-type="entity-link" >MapLegend</a>
                                </li>
                                <li class="link">
                                    <a href="directives/MapPrimaryMarks.html" data-type="entity-link" >MapPrimaryMarks</a>
                                </li>
                                <li class="link">
                                    <a href="directives/Marks.html" data-type="entity-link" >Marks</a>
                                </li>
                                <li class="link">
                                    <a href="directives/PrimaryMarks.html" data-type="entity-link" >PrimaryMarks</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StackedAreaEventsDirective.html" data-type="entity-link" >StackedAreaEventsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StackedBarsEventsDirective.html" data-type="entity-link" >StackedBarsEventsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/VicMapAuxMarks.html" data-type="entity-link" >VicMapAuxMarks</a>
                                </li>
                                <li class="link">
                                    <a href="directives/VicXyPrimaryMarks.html" data-type="entity-link" >VicXyPrimaryMarks</a>
                                </li>
                                <li class="link">
                                    <a href="directives/XyAuxMarks.html" data-type="entity-link" >XyAuxMarks</a>
                                </li>
                                <li class="link">
                                    <a href="directives/XyAxis.html" data-type="entity-link" >XyAxis</a>
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
                                <a href="classes/AreaFills.html" data-type="entity-link" >AreaFills</a>
                            </li>
                            <li class="link">
                                <a href="classes/AreaFillsBuilder.html" data-type="entity-link" >AreaFillsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/AttributeDataDimension.html" data-type="entity-link" >AttributeDataDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/AttributeDataDimensionBuilder.html" data-type="entity-link" >AttributeDataDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuxMarksConfig.html" data-type="entity-link" >AuxMarksConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/AxisBaseline.html" data-type="entity-link" >AxisBaseline</a>
                            </li>
                            <li class="link">
                                <a href="classes/AxisBaselineBuilder.html" data-type="entity-link" >AxisBaselineBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/AxisLabel.html" data-type="entity-link" >AxisLabel</a>
                            </li>
                            <li class="link">
                                <a href="classes/AxisLabelBuilder.html" data-type="entity-link" >AxisLabelBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsBackgrounds.html" data-type="entity-link" >BarsBackgrounds</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsBackgroundsBuilder.html" data-type="entity-link" >BarsBackgroundsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsClickEmitTooltipDataPauseOtherActions.html" data-type="entity-link" >BarsClickEmitTooltipDataPauseOtherActions</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsComponentStub.html" data-type="entity-link" >BarsComponentStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsConfig.html" data-type="entity-link" >BarsConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsHoverEmitTooltipData.html" data-type="entity-link" >BarsHoverEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsHoverMoveEmitTooltipData.html" data-type="entity-link" >BarsHoverMoveEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsHoverShowLabels.html" data-type="entity-link" >BarsHoverShowLabels</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsLabels.html" data-type="entity-link" >BarsLabels</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsLabelsBuilder.html" data-type="entity-link" >BarsLabelsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/BarsTooltipPositioner.html" data-type="entity-link" >BarsTooltipPositioner</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseDimensionsBuilder.html" data-type="entity-link" >BaseDimensionsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/CalculatedBinsAttributeDataDimension.html" data-type="entity-link" >CalculatedBinsAttributeDataDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/CalculatedBinsAttributeDataDimensionBuilder.html" data-type="entity-link" >CalculatedBinsAttributeDataDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoricalBinsAttributeDataDimension.html" data-type="entity-link" >CategoricalBinsAttributeDataDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoricalBinsBuilder.html" data-type="entity-link" >CategoricalBinsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/Chart.html" data-type="entity-link" >Chart</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChartComponentStub.html" data-type="entity-link" >ChartComponentStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChartConfig.html" data-type="entity-link" >ChartConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClickDirectiveStub.html" data-type="entity-link" >ClickDirectiveStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/ColorUtilities.html" data-type="entity-link" >ColorUtilities</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomBreaksBinsAttributeDataDimension.html" data-type="entity-link" >CustomBreaksBinsAttributeDataDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomBreaksBinsAttributeDataDimensionBuilder.html" data-type="entity-link" >CustomBreaksBinsAttributeDataDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataDimension.html" data-type="entity-link" >DataDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataDimensionBuilder.html" data-type="entity-link" >DataDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataMarksConfig.html" data-type="entity-link" >DataMarksConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateChartPositionDimension.html" data-type="entity-link" >DateChartPositionDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateChartPositionDimensionBuilder.html" data-type="entity-link" >DateChartPositionDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyRefStub.html" data-type="entity-link" >DestroyRefStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/DomainPadding.html" data-type="entity-link" >DomainPadding</a>
                            </li>
                            <li class="link">
                                <a href="classes/DotsConfig.html" data-type="entity-link" >DotsConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/DotsHoverDefaultStyles.html" data-type="entity-link" >DotsHoverDefaultStyles</a>
                            </li>
                            <li class="link">
                                <a href="classes/DotsHoverMoveDefaultStyles.html" data-type="entity-link" >DotsHoverMoveDefaultStyles</a>
                            </li>
                            <li class="link">
                                <a href="classes/DotsHoverMoveEmitTooltipData.html" data-type="entity-link" >DotsHoverMoveEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/DotsTooltipPositioner.html" data-type="entity-link" >DotsTooltipPositioner</a>
                            </li>
                            <li class="link">
                                <a href="classes/EqualFrequenciesAttributeDataDimension.html" data-type="entity-link" >EqualFrequenciesAttributeDataDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/EqualFrequenciesAttributeDataDimensionBuilder.html" data-type="entity-link" >EqualFrequenciesAttributeDataDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/EqualValueRangesAttributeDataDimension.html" data-type="entity-link" >EqualValueRangesAttributeDataDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/EqualValueRangesBinsBuilder.html" data-type="entity-link" >EqualValueRangesBinsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventDirectiveStub.html" data-type="entity-link" >EventDirectiveStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/FillUtilities.html" data-type="entity-link" >FillUtilities</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesAttributeDataLayer.html" data-type="entity-link" >GeographiesAttributeDataLayer</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesAttributeDataLayerBuilder.html" data-type="entity-link" >GeographiesAttributeDataLayerBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesClickEmitTooltipDataPauseOtherActions.html" data-type="entity-link" >GeographiesClickEmitTooltipDataPauseOtherActions</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesConfig.html" data-type="entity-link" >GeographiesConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesGeojsonPropertiesLayer.html" data-type="entity-link" >GeographiesGeojsonPropertiesLayer</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesGeojsonPropertiesLayerBuilder.html" data-type="entity-link" >GeographiesGeojsonPropertiesLayerBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesHoverEmitTooltipData.html" data-type="entity-link" >GeographiesHoverEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesHoverMoveEmitTooltipData.html" data-type="entity-link" >GeographiesHoverMoveEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesLabels.html" data-type="entity-link" >GeographiesLabels</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesLabelsBuilder.html" data-type="entity-link" >GeographiesLabelsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesLayer.html" data-type="entity-link" >GeographiesLayer</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesLayerBuilder.html" data-type="entity-link" >GeographiesLayerBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeographiesTooltipPositioner.html" data-type="entity-link" >GeographiesTooltipPositioner</a>
                            </li>
                            <li class="link">
                                <a href="classes/Grid.html" data-type="entity-link" >Grid</a>
                            </li>
                            <li class="link">
                                <a href="classes/GridBuilder.html" data-type="entity-link" >GridBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupedBarsConfig.html" data-type="entity-link" >GroupedBarsConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/HorizontalBarsDimensionsBuilder.html" data-type="entity-link" >HorizontalBarsDimensionsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/HoverDirectiveStub.html" data-type="entity-link" >HoverDirectiveStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/HoverMoveDirectiveStub.html" data-type="entity-link" >HoverMoveDirectiveStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/HtmlTooltipCdkManagedPosition.html" data-type="entity-link" >HtmlTooltipCdkManagedPosition</a>
                            </li>
                            <li class="link">
                                <a href="classes/HtmlTooltipConfig.html" data-type="entity-link" >HtmlTooltipConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/HtmlTooltipSize.html" data-type="entity-link" >HtmlTooltipSize</a>
                            </li>
                            <li class="link">
                                <a href="classes/HtmlTooltipSizeBuilder.html" data-type="entity-link" >HtmlTooltipSizeBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/InputEventDirectiveStub.html" data-type="entity-link" >InputEventDirectiveStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesClickEmitTooltipDataPauseHoverMoveActions.html" data-type="entity-link" >LinesClickEmitTooltipDataPauseHoverMoveActions</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesComponentStub.html" data-type="entity-link" >LinesComponentStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesConfig.html" data-type="entity-link" >LinesConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesHoverMoveDefaultLinesStyles.html" data-type="entity-link" >LinesHoverMoveDefaultLinesStyles</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesHoverMoveDefaultMarkersStyles.html" data-type="entity-link" >LinesHoverMoveDefaultMarkersStyles</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesHoverMoveDefaultStyles.html" data-type="entity-link" >LinesHoverMoveDefaultStyles</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesHoverMoveEmitTooltipData.html" data-type="entity-link" >LinesHoverMoveEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesMarkerClickEmitTooltipData.html" data-type="entity-link" >LinesMarkerClickEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesStroke.html" data-type="entity-link" >LinesStroke</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesStrokeBuilder.html" data-type="entity-link" >LinesStrokeBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinesTooltipPositioner.html" data-type="entity-link" >LinesTooltipPositioner</a>
                            </li>
                            <li class="link">
                                <a href="classes/MainServiceStub.html" data-type="entity-link" >MainServiceStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/MapAuxMarksStub.html" data-type="entity-link" >MapAuxMarksStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/MapChartComponentStub.html" data-type="entity-link" >MapChartComponentStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/MapLegendComponentStub.html" data-type="entity-link" >MapLegendComponentStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/MapLegendContentStub.html" data-type="entity-link" >MapLegendContentStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/MapPrimaryMarksStub.html" data-type="entity-link" >MapPrimaryMarksStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/MarksConfig.html" data-type="entity-link" >MarksConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoBinsAttributeDataDimension.html" data-type="entity-link" >NoBinsAttributeDataDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoBinsAttributeDataDimensionBuilder.html" data-type="entity-link" >NoBinsAttributeDataDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/NumberChartPositionDimension.html" data-type="entity-link" >NumberChartPositionDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/NumberChartPositionDimensionBuilder.html" data-type="entity-link" >NumberChartPositionDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/NumberDimension.html" data-type="entity-link" >NumberDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/NumberVisualValueDimension.html" data-type="entity-link" >NumberVisualValueDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/NumberVisualValueDimensionBuilder.html" data-type="entity-link" >NumberVisualValueDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrdinalAxisStub.html" data-type="entity-link" >OrdinalAxisStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrdinalChartPositionDimension.html" data-type="entity-link" >OrdinalChartPositionDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrdinalChartPositionDimensionBuilder.html" data-type="entity-link" >OrdinalChartPositionDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrdinalVisualValueDimension.html" data-type="entity-link" >OrdinalVisualValueDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrdinalVisualValueDimensionBuilder.html" data-type="entity-link" >OrdinalVisualValueDimensionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/OverlayRefStub.html" data-type="entity-link" >OverlayRefStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/OverlayStub.html" data-type="entity-link" >OverlayStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/PercentOverDomainPadding.html" data-type="entity-link" >PercentOverDomainPadding</a>
                            </li>
                            <li class="link">
                                <a href="classes/PixelDomainPadding.html" data-type="entity-link" >PixelDomainPadding</a>
                            </li>
                            <li class="link">
                                <a href="classes/PointMarkers.html" data-type="entity-link" >PointMarkers</a>
                            </li>
                            <li class="link">
                                <a href="classes/PointMarkersBuilder.html" data-type="entity-link" >PointMarkersBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrimaryMarksBuilder.html" data-type="entity-link" >PrimaryMarksBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrimaryMarksConfig.html" data-type="entity-link" >PrimaryMarksConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrimaryMarksStub.html" data-type="entity-link" >PrimaryMarksStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuantitativeAxisStub.html" data-type="entity-link" >QuantitativeAxisStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuantitativeRulesConfig.html" data-type="entity-link" >QuantitativeRulesConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuantitativeRulesLabels.html" data-type="entity-link" >QuantitativeRulesLabels</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuantitativeTicks.html" data-type="entity-link" >QuantitativeTicks</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuantitativeTicksBuilder.html" data-type="entity-link" >QuantitativeTicksBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoundUpToIntervalDomainPadding.html" data-type="entity-link" >RoundUpToIntervalDomainPadding</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoundUpToSigFigDomainPadding.html" data-type="entity-link" >RoundUpToSigFigDomainPadding</a>
                            </li>
                            <li class="link">
                                <a href="classes/RulesLabelsBuilder.html" data-type="entity-link" >RulesLabelsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/StackedAreaComponentStub.html" data-type="entity-link" >StackedAreaComponentStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/StackedAreaConfig.html" data-type="entity-link" >StackedAreaConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/StackedAreaHoverMoveEmitTooltipData.html" data-type="entity-link" >StackedAreaHoverMoveEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StackedAreaTooltipPositioner.html" data-type="entity-link" >StackedAreaTooltipPositioner</a>
                            </li>
                            <li class="link">
                                <a href="classes/StackedBarsClickEmitTooltipDataPauseOtherActions.html" data-type="entity-link" >StackedBarsClickEmitTooltipDataPauseOtherActions</a>
                            </li>
                            <li class="link">
                                <a href="classes/StackedBarsConfig.html" data-type="entity-link" >StackedBarsConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/StackedBarsHoverEmitTooltipData.html" data-type="entity-link" >StackedBarsHoverEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StackedBarsHoverMoveEmitTooltipData.html" data-type="entity-link" >StackedBarsHoverMoveEmitTooltipData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stroke.html" data-type="entity-link" >Stroke</a>
                            </li>
                            <li class="link">
                                <a href="classes/StrokeBase.html" data-type="entity-link" >StrokeBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/StrokeBuilder.html" data-type="entity-link" >StrokeBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SvgTextWrap.html" data-type="entity-link" >SvgTextWrap</a>
                            </li>
                            <li class="link">
                                <a href="classes/SvgTextWrapBuilder.html" data-type="entity-link" >SvgTextWrapBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SvgTooltip.html" data-type="entity-link" >SvgTooltip</a>
                            </li>
                            <li class="link">
                                <a href="classes/Ticks.html" data-type="entity-link" >Ticks</a>
                            </li>
                            <li class="link">
                                <a href="classes/TicksBuilder.html" data-type="entity-link" >TicksBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/TickWrap.html" data-type="entity-link" >TickWrap</a>
                            </li>
                            <li class="link">
                                <a href="classes/TickWrapBuilder.html" data-type="entity-link" >TickWrapBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tooltip.html" data-type="entity-link" >Tooltip</a>
                            </li>
                            <li class="link">
                                <a href="classes/TooltipPosition.html" data-type="entity-link" >TooltipPosition</a>
                            </li>
                            <li class="link">
                                <a href="classes/TooltipPositionBuilder.html" data-type="entity-link" >TooltipPositionBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/TooltipPositioner.html" data-type="entity-link" >TooltipPositioner</a>
                            </li>
                            <li class="link">
                                <a href="classes/UtilitiesServiceStub.html" data-type="entity-link" >UtilitiesServiceStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidateDomain.html" data-type="entity-link" >ValidateDomain</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidateValue.html" data-type="entity-link" >ValidateValue</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValueUtilities.html" data-type="entity-link" >ValueUtilities</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerticalBarsDimensionsBuilder.html" data-type="entity-link" >VerticalBarsDimensionsBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicAuxMarksBuilder.html" data-type="entity-link" >VicAuxMarksBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicColumnConfig.html" data-type="entity-link" >VicColumnConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicDataExportConfig.html" data-type="entity-link" >VicDataExportConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicJpegImageConfig.html" data-type="entity-link" >VicJpegImageConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicOrdinalAxisConfig.html" data-type="entity-link" >VicOrdinalAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicPngImageConfig.html" data-type="entity-link" >VicPngImageConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicQuantitativeAxisConfig.html" data-type="entity-link" >VicQuantitativeAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicSvgImageConfig.html" data-type="entity-link" >VicSvgImageConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicXOrdinalAxisConfig.html" data-type="entity-link" >VicXOrdinalAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicXQuantitativeAxisConfig.html" data-type="entity-link" >VicXQuantitativeAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicYOrdinalAxisConfig.html" data-type="entity-link" >VicYOrdinalAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/VicYQuantitativeAxisConfig.html" data-type="entity-link" >VicYQuantitativeAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/XAxisConfig.html" data-type="entity-link" >XAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/XAxisStub.html" data-type="entity-link" >XAxisStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/XyAxisBaseBuilder.html" data-type="entity-link" >XyAxisBaseBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/XyAxisConfig.html" data-type="entity-link" >XyAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/XyAxisElementStub.html" data-type="entity-link" >XyAxisElementStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/XyAxisStub.html" data-type="entity-link" >XyAxisStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/XyChartComponentStub.html" data-type="entity-link" >XyChartComponentStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/XyMarksConfig.html" data-type="entity-link" >XyMarksConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/XyPrimaryMarksConfig.html" data-type="entity-link" >XyPrimaryMarksConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/XyPrimaryMarksStub.html" data-type="entity-link" >XyPrimaryMarksStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/YAxisConfig.html" data-type="entity-link" >YAxisConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/YAxisStub.html" data-type="entity-link" >YAxisStub</a>
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
                                    <a href="injectables/VicBarsConfigBuilder.html" data-type="entity-link" >VicBarsConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicChartConfigBuilder.html" data-type="entity-link" >VicChartConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicDataExport.html" data-type="entity-link" >VicDataExport</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicDotsConfigBuilder.html" data-type="entity-link" >VicDotsConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicGeographiesConfigBuilder.html" data-type="entity-link" >VicGeographiesConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicGroupedBarsConfigBuilder.html" data-type="entity-link" >VicGroupedBarsConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicHtmlTooltipConfigBuilder.html" data-type="entity-link" >VicHtmlTooltipConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicImageDownloadService.html" data-type="entity-link" >VicImageDownloadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicLinesConfigBuilder.html" data-type="entity-link" >VicLinesConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicQuantitativeRulesConfigBuilder.html" data-type="entity-link" >VicQuantitativeRulesConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicStackedAreaConfigBuilder.html" data-type="entity-link" >VicStackedAreaConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicStackedBarsConfigBuilder.html" data-type="entity-link" >VicStackedBarsConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicXOrdinalAxisConfigBuilder.html" data-type="entity-link" >VicXOrdinalAxisConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicXQuantitativeAxisConfigBuilder.html" data-type="entity-link" >VicXQuantitativeAxisConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicYOrdinalAxisConfigBuilder.html" data-type="entity-link" >VicYOrdinalAxisConfigBuilder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VicYQuantitativeAxisConfigBuilder.html" data-type="entity-link" >VicYQuantitativeAxisConfigBuilder</a>
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
                                <a href="interfaces/ActionHost.html" data-type="entity-link" >ActionHost</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AreaFillsOptions.html" data-type="entity-link" >AreaFillsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttributeDataDimensionOptions.html" data-type="entity-link" >AttributeDataDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AxisBaselineOptions.html" data-type="entity-link" >AxisBaselineOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AxisLabelOptions.html" data-type="entity-link" >AxisLabelOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AxisSpecificQuantitativeTickBuilderOptions.html" data-type="entity-link" >AxisSpecificQuantitativeTickBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AxisSpecificTickBuilderOptions.html" data-type="entity-link" >AxisSpecificTickBuilderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarsBackgroundsOptions.html" data-type="entity-link" >BarsBackgroundsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarsDimensions.html" data-type="entity-link" >BarsDimensions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarsHost.html" data-type="entity-link" >BarsHost</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarsInteractionOutput.html" data-type="entity-link" >BarsInteractionOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarsLabelsOptions.html" data-type="entity-link" >BarsLabelsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarsOptions.html" data-type="entity-link" >BarsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarsTooltipDatum.html" data-type="entity-link" >BarsTooltipDatum</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CalculatedBinsAttributeDataDimensionOptions.html" data-type="entity-link" >CalculatedBinsAttributeDataDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CategoricalBinsOptions.html" data-type="entity-link" >CategoricalBinsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartResizing.html" data-type="entity-link" >ChartResizing</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomBreaksBinsAttributeDataDimensionOptions.html" data-type="entity-link" >CustomBreaksBinsAttributeDataDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataDimensionOptions.html" data-type="entity-link" >DataDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataMarksOptions.html" data-type="entity-link" >DataMarksOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DateChartPositionDimensionOptions.html" data-type="entity-link" >DateChartPositionDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Dimensions.html" data-type="entity-link" >Dimensions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DotsHost.html" data-type="entity-link" >DotsHost</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DotsInteractionOutput.html" data-type="entity-link" >DotsInteractionOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DotsOptions.html" data-type="entity-link" >DotsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DotsTooltipDatum.html" data-type="entity-link" >DotsTooltipDatum</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ElementSpacing.html" data-type="entity-link" >ElementSpacing</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EqualFrequenciesAttributeDataDimensionOptions.html" data-type="entity-link" >EqualFrequenciesAttributeDataDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EqualValueRangesAttributeDataDimensionOptions.html" data-type="entity-link" >EqualValueRangesAttributeDataDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventAction.html" data-type="entity-link" >EventAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventStrategy.html" data-type="entity-link" >EventStrategy</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FillDefinition.html" data-type="entity-link" >FillDefinition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GenericScale.html" data-type="entity-link" >GenericScale</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesAttributeDataLayerOptions.html" data-type="entity-link" >GeographiesAttributeDataLayerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesGeojsonPropertiesLayerOptions.html" data-type="entity-link" >GeographiesGeojsonPropertiesLayerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesInteractionOutput.html" data-type="entity-link" >GeographiesInteractionOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesLabelsColorOptions.html" data-type="entity-link" >GeographiesLabelsColorOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesLabelsFontWeightOptions.html" data-type="entity-link" >GeographiesLabelsFontWeightOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesLabelsOptions.html" data-type="entity-link" >GeographiesLabelsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesLayerOptions.html" data-type="entity-link" >GeographiesLayerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesOptions.html" data-type="entity-link" >GeographiesOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeographiesTooltipDatum.html" data-type="entity-link" >GeographiesTooltipDatum</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridOptions.html" data-type="entity-link" >GridOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupedBarsOptions.html" data-type="entity-link" >GroupedBarsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HoverMoveAction.html" data-type="entity-link" >HoverMoveAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HtmlTooltipOptions.html" data-type="entity-link" >HtmlTooltipOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HtmlTooltipSizeOptions.html" data-type="entity-link" >HtmlTooltipSizeOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImageDownloadOptions.html" data-type="entity-link" >ImageDownloadOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMarks.html" data-type="entity-link" >IMarks</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InputEventAction.html" data-type="entity-link" >InputEventAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InteractionOutput.html" data-type="entity-link" >InteractionOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LinesHost.html" data-type="entity-link" >LinesHost</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LinesInteractionOutput.html" data-type="entity-link" >LinesInteractionOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LinesMarkerDatum.html" data-type="entity-link" >LinesMarkerDatum</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LinesOptions.html" data-type="entity-link" >LinesOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LinesStrokeOptions.html" data-type="entity-link" >LinesStrokeOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LinesTooltipDatum.html" data-type="entity-link" >LinesTooltipDatum</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MarksHost.html" data-type="entity-link" >MarksHost</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MarksOptions.html" data-type="entity-link" >MarksOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NoBinsAttributeDataDimensionOptions.html" data-type="entity-link" >NoBinsAttributeDataDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NumberChartPositionDimensionOptions.html" data-type="entity-link" >NumberChartPositionDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NumberDimensionOptions.html" data-type="entity-link" >NumberDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NumberVisualValueDimensionOptions.html" data-type="entity-link" >NumberVisualValueDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrdinalChartPositionDimensionOptions.html" data-type="entity-link" >OrdinalChartPositionDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrdinalVisualValueDimensionOptions.html" data-type="entity-link" >OrdinalVisualValueDimensionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaddedDomainArguments.html" data-type="entity-link" >PaddedDomainArguments</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PercentOverDomainPaddingOptions.html" data-type="entity-link" >PercentOverDomainPaddingOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PixelDomainPaddingOptions.html" data-type="entity-link" >PixelDomainPaddingOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PointMarkersOptions.html" data-type="entity-link" >PointMarkersOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Position.html" data-type="entity-link" >Position</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuantitativeRulesDimensions.html" data-type="entity-link" >QuantitativeRulesDimensions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuantitativeRulesLabelsOptions.html" data-type="entity-link" >QuantitativeRulesLabelsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuantitativeRulesOptions.html" data-type="entity-link" >QuantitativeRulesOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuantitativeTicksOptions.html" data-type="entity-link" >QuantitativeTicksOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Ranges.html" data-type="entity-link" >Ranges</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReactiveConfig.html" data-type="entity-link" >ReactiveConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoundUpToIntervalDomainPaddingOptions.html" data-type="entity-link" >RoundUpToIntervalDomainPaddingOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoundUpToSigFigDomainPaddingOptions.html" data-type="entity-link" >RoundUpToSigFigDomainPaddingOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StackedAreaInteractionAnchor.html" data-type="entity-link" >StackedAreaInteractionAnchor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StackedAreaInteractionOutput.html" data-type="entity-link" >StackedAreaInteractionOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StackedAreaOptions.html" data-type="entity-link" >StackedAreaOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StackedAreaTooltipDatum.html" data-type="entity-link" >StackedAreaTooltipDatum</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StackedBarsHost.html" data-type="entity-link" >StackedBarsHost</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StackedBarsOptions.html" data-type="entity-link" >StackedBarsOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrokeBaseOptions.html" data-type="entity-link" >StrokeBaseOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrokeOptions.html" data-type="entity-link" >StrokeOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SvgTextWrapOptions.html" data-type="entity-link" >SvgTextWrapOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TicksOptions.html" data-type="entity-link" >TicksOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TickWrapOptions.html" data-type="entity-link" >TickWrapOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VicOrdinalAxisOptions.html" data-type="entity-link" >VicOrdinalAxisOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VicQuantitativeAxisOptions.html" data-type="entity-link" >VicQuantitativeAxisOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VicValueFormats.html" data-type="entity-link" >VicValueFormats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XAxisOptions.html" data-type="entity-link" >XAxisOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XyAxisBaseOptions.html" data-type="entity-link" >XyAxisBaseOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XyChartScales.html" data-type="entity-link" >XyChartScales</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XyMarks.html" data-type="entity-link" >XyMarks</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/YAxisOptions.html" data-type="entity-link" >YAxisOptions</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/ResizeChartHeightPipe.html" data-type="entity-link" >ResizeChartHeightPipe</a>
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
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
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