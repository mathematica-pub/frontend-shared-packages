// @NgModule({
//   declarations: [AppComponent],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     BrowserAnimationsModule,
//     SidebarComponent,
//   ],
//   providers: [
//     provideHttpClient(),
//     {
//       provide: APP_INITIALIZER,
//       multi: true,
//       useFactory: (config: ManualDocumentationConfigService) => {
//         return () => {
//           config.initConfigs([Library.UiComponents, Library.VizComponents]);
//         };
//       },
//       deps: [ManualDocumentationConfigService],
//     },
//   ],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}
