sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "btplpshellcai/model/models",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Button"
],
    function (UIComponent, Device, models, Dialog, Text, Button) {
        "use strict";

        return UIComponent.extend("btplpshellcai.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                // shell
                var rendererPromise = this._getRenderer();
                rendererPromise.then(function (oRenderer) {
                    oRenderer.addHeaderItem({
                        icon: "sap-icon://add",
                        tooltip: "Add bookmark",
                        press: function () {
                            var oDialog = new Dialog({
                                contentWidth: "25rem",
                                title: "Whats new",
                                type: "Message",
                                content: new Text({
                                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                }),
                                beginButton: new Button({
                                    type: "Emphasized",
                                    text: "Ok",
                                    press: function () {
                                        oDialog.close();
                                    }
                                }),
                                afterClose: function () {
                                    oDialog.destroy();
                                }
                            });
                            oDialog.open();
                        }
                    }, true, true);
                    // oRenderer.addHeaderItem({icon: "sap-icon://factory"},true,true);
                });

                this.renderRecastChatbot();
            },
            renderRecastChatbot: function () {
                //  source: https://blogs.sap.com/2020/06/02/connectivity-of-sap-conversational-ai-bot-with-sap-flp-on-sap-cloud-platform/
                if (!document.getElementById("cai-webchat")) {
                    var s = document.createElement("script");
                    s.setAttribute("id", "cai-webchat");
                    s.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
                    document.body.appendChild(s);
                }
                s.setAttribute("channelId", "f0319f72-b1a6-4205-aee7-3a806f5cd170");
                s.setAttribute("token", "3f52a86b6f598e30cfcfa6fb8ba3cba7");
            },


            _getRenderer: function () {
                var that = this,
                    oDeferred = new jQuery.Deferred(),
                    oRenderer;


                that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
                if (!that._oShellContainer) {
                    oDeferred.reject(
                        "Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
                } else {
                    oRenderer = that._oShellContainer.getRenderer();
                    if (oRenderer) {
                        oDeferred.resolve(oRenderer);
                    } else {
                        // renderer not initialized yet, listen to rendererCreated event
                        that._onRendererCreated = function (oEvent) {
                            oRenderer = oEvent.getParameter("renderer");
                            if (oRenderer) {
                                oDeferred.resolve(oRenderer);
                            } else {
                                oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
                            }
                        };
                        that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
                    }
                }
                return oDeferred.promise();
            }
        });
    }
);