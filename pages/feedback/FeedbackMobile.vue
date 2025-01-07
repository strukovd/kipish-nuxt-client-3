<template>
  <div id="top" class="feedback-mobile mmid">
    <v-dialog class="calendar-dialog" overlay-color="#1e1e1e" v-model="modal.show" max-width="600">
      <div elevation="0" color="transparent" style="background:#fff !important; padding:1.4em 1em; font-size:1.6em;">
        <p>
          <!-- <v-icon size="40" @click="modal.show=false" class="close-icon" style="color:#333; padding:0 .2em .6em;">mdi-check</v-icon> -->
          <span style="color:#333;">{{ modal.message }}</span>
        </p>

        <BaseButton prependIcon="mdi-close" @click="modal.show=false; navigateTo({path: '/'});" class="mt-4">Закрыть</BaseButton>
      </div>
    </v-dialog>

    <v-row class="ma-0 pa-0 wrapper">
      <v-col style="min-height: 70vh" class="pa-0 px-4 mb-100" cols="12">
        <v-card elevation="0" color="transparent">
          <!-- BREADCRUMBS -->
          <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/feedback', title: 'Обратная связь'}]"/>
          <!-- CONTENT -->
          <loader v-if="loading"/>
          <div class="feedback-content" v-else>
            <v-form class="form" @submit.prevent="sendForm">
              <h1 style="font-size:1.4em; line-height:1.4em; margin-bottom:1em; text-align:center;" class="h1-font">Профессиональные фото и видео отчёты ваших событий! <br> Закажите прямо сейчас!</h1>
              <v-text-field class="fb-textfield" v-model="model.name" label="Ваше имя" :error-messages="errors.name" outlined required></v-text-field>
              <v-text-field class="fb-textfield" v-model="model.contacts" @input="mask($event, `+996 (###) ## ## ##`, `contacts`)" label="Номер телефона" :error-messages="errors.contacts" outlined required></v-text-field>
              <v-textarea class="fb-textarea" v-model="model.message" label="Опишите предстоящее событие, предполагаему дату, время, а также ваши пожелания и прочие детали" :error-messages="errors.message" outlined required></v-textarea>
              <BaseButton prependIcon="mdi-check" @click="sendForm" @keyup.enter="sendForm">Отправить</BaseButton>
            </v-form>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import BaseBreadcrumbs from '~/components/common/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/BaseButton.vue';
import Loader from '~/components/common/Loader.vue';


export default {
  name: "FeedbackMobile",
  components: { Loader, BaseBreadcrumbs, BaseButton },
  data: () => {
    return {
      loading: false,
      errors: {
        name: '',
        contacts: '',
        message: ''
      },
      model: {
        name: '',
        contacts: '',
        message: ''
      } as any,
      modal: {
        show: false,
        message: '',
      }
    }
  },
  methods: {
    mask(event: any, mask: string, fieldName: string) {
      const input = event.target?.value; // Получаем текущее значение поля
      let maskedValue = '';
      let maskIndex = 0;
      let inputIndex = 0;

      while (maskIndex < mask?.length && inputIndex < input?.length) {
        const maskChar = mask[maskIndex];
        const inputChar = input[inputIndex];

        if (maskChar === '#') {
          if (/\d/.test(inputChar)) {
            maskedValue += inputChar;
            maskIndex++;
          }
          inputIndex++;
        } else if (maskChar === 'A') {
          if (/[a-zA-Z]/.test(inputChar)) {
            maskedValue += inputChar;
            maskIndex++;
          }
          inputIndex++;
        } else if (maskChar === '*') {
          maskedValue += inputChar;
          maskIndex++;
          inputIndex++;
        } else {
          maskedValue += maskChar; // Статический символ маски (например, скобка или пробел)
          if (inputChar === maskChar) {
            inputIndex++;
          }
          maskIndex++;
        }
      }

      // Обновляем значение поля ввода
      this.model[fieldName] = maskedValue;
    },

    sendForm() {
      this.errors.name = '';
      this.errors.contacts = '';

      if(this.model.name === '' ) {
        this.errors.name = 'Поле не должно быть пустым!';
        return;
      }

      if(!this.model.contacts || this.model.contacts.length < 19) {
        this.errors.contacts = 'Номер телефона обязателен для заполнения!';
        return;
      }

      this.loading = true;
      this.$http.post('/feedback', this.model)
        .then(r => {
          this.modal.message = `Спасибо за вашу заявку. Мы свяжемся с вами в ближайшее время`;
          this.modal.show = true;
        })
        .finally(() => {
          this.loading = false;
        })
    }
  },
}
</script>


<style lang="scss">
.feedback-mobile {
  .feedback-content {
    .form {
      max-width: 1312px;
      margin: 3em auto 0;

      .fb-textfield {

      }
      .fb-textarea {

      }
      .fb-button {
        color:#fff;
        border-radius:16px;
        width:100%;
      }
    }
  }
}

.dark-theme {
  .feedback-desktop {
    .feedback-content {
      .form {
        .fb-textfield, .fb-textarea {
          .v-input__slot {
            background:#222 !important;

            &:hover fieldset {
              // border: none !important;
              // outline: none !important;
            }
          }
          .v-label {
            color:#ffffff9c !important;
          }
          input, textarea {
            color:#dddddd !important;
          }
        }
        .fb-button {
          background-color:#e73030 !important;
        }
      }
    }
  }
}
</style>
