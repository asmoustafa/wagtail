/* global ModalWorkflow */

import $ from 'jquery';

$(() => {
  /* Interface to set permissions from the explorer / editor */
  // eslint-disable-next-line func-names
  $('[data-a11y-dialog-show="set-privacy"]').on('click', function () {
    ModalWorkflow({
      dialogId: 'set-privacy',
      url: this.getAttribute('data-url'),
      onload: {
        set_privacy(modal) {
          // eslint-disable-next-line func-names
          $('form', modal.body).on('submit', function () {
            modal.postForm(this.action, $(this).serialize());
            return false;
          });

          const restrictionTypePasswordField = $(
            "input[name='restriction_type'][value='password']",
            modal.body,
          );
          const restrictionTypeGroupsField = $(
            "input[name='restriction_type'][value='groups']",
            modal.body,
          );
          const passwordField = $('[name="password"]', modal.body).parents(
            '[data-field-wrapper]',
          );
          const groupsFields = $('#groups-fields', modal.body);

          function refreshFormFields() {
            if (restrictionTypePasswordField.is(':checked')) {
              passwordField.show();
              groupsFields.hide();
            } else if (restrictionTypeGroupsField.is(':checked')) {
              passwordField.hide();
              groupsFields.show();
            } else {
              passwordField.hide();
              groupsFields.hide();
            }
          }
          refreshFormFields();

          $("input[name='restriction_type']", modal.body).on(
            'change',
            refreshFormFields,
          );
        },
        set_privacy_done(modal, jsonData) {
          modal.respond('setPermission', jsonData.is_public);
          modal.close();
        },
      },
      responses: {
        setPermission(isPublic) {
          if (isPublic) {
            // Swap the status sidebar text and icon
            $('[data-privacy-sidebar-public]').removeClass('w-hidden');
            $('[data-privacy-sidebar-private]').addClass('w-hidden');

            // Swap other privacy indicators in settings and the header live button
            $('.privacy-indicator').removeClass('private').addClass('public');
            $('.privacy-indicator-icon use').attr('href', '#icon-view');

            // Show the public text and hide the private text
            $('[data-privacy-status="public"]').removeClass('w-hidden');
            $('[data-privacy-status="private"]').addClass('w-hidden');
          } else {
            // Swap the status sidebar text and icon
            $('[data-privacy-sidebar-public]').addClass('w-hidden');
            $('[data-privacy-sidebar-private]').removeClass('w-hidden');

            // Swap other privacy indicators in settings and the headers live button icon
            $('.privacy-indicator').removeClass('public').addClass('private');
            $('.privacy-indicator-icon use').attr('href', '#icon-no-view');

            // Show the private text and hide the public text
            $('[data-privacy-status="public"]').addClass('w-hidden');
            $('[data-privacy-status="private"]').removeClass('w-hidden');
          }
        },
      },
    });
    return false;
  });
});
