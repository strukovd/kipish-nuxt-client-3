<template>
  <div class="book-modal">
    <form class="form" @submit.prevent="sendForm">
      <template v-if="!success">
        <BaseTextBox v-model="form.name"      :error="formErrors.name"      label="Ваше имя" />
        <BaseTextBox v-model="form.contacts"  :error="formErrors.contacts"  label="Контакты" />
        <BaseTextBox v-model="form.message"   :error="formErrors.message"   label="Примечания или комментарий" />
        <BaseButton @click="sendForm" style="border-radius:16px !important;width:100%" color="#272727" class="py-8 px-15 hover-red mt-4"><span class="text-20 white--text opacity-70 ml-3">Забронировать</span></BaseButton>
        <button class="close-btn" @click="close"><v-icon color="#FFFFFFCF">mdi-close</v-icon></button>
      </template>
      <template v-else>
        <div class="text-32 black--text text-center font-title">
          <h2 style="padding-bottom:.4em;"><span>Заявка принята</span></h2>
          <span>С Вами свяжутся в ближайшее время!</span>
        </div>
        <div class="close-btn" @click="close"><v-icon color="#FFFFFFCF">mdi-close</v-icon></div>
      </template>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseTextBox from '../common/BaseTextBox.vue';
import BaseButton from '../common/BaseButton.vue';
import { mapStores } from 'pinia';

export default defineComponent({
  props: ['payload'],
  components: { BaseTextBox, BaseButton },
  computed: {
    ...mapStores( useAppStore ),
  },
  data() {
    return {
      success: false,
      form: {
        name: '',
        contacts: '',
        message: ''
      },
      formErrors: {
        name: '',
        contacts: '',
        message: ''
      },
    };
  },
  methods: {
    confirm() {
      const appStore = useAppStore();
      if (appStore) {
        const modal = appStore.modals.pop();
        if(modal && modal.resolve) modal?.resolve(true);
      }
    },

    close() {
      const appStore = useAppStore();
      if (appStore) {
        const modal = appStore.modals.pop();
        if(modal && modal.resolve) modal?.resolve(false);
      }
    },

    sendForm() {
      this.formErrors.name = '';
      this.formErrors.contacts = '';

      if(this.form.name === '' ) {
        this.formErrors.name = 'Поле не должно быть пустым!';
        return;
      }

      if(!this.form.contacts) {
        this.formErrors.contacts = 'Поле не должно быть пустым!';
        return;
      }

      const body = {
        ...this.form,
        establishment: { id: this.appStore.sourceId }
      };

      this.$http.post(`/booking`, body)
        .then(() => {
          this.success = true;
        });
    },
  },
});
</script>

<style lang="scss">
.book-modal {
  margin: auto;
  flex:auto 1 0;
  display: flex;

  .form {
    padding:4em 5em;
    background-color: #f0f0f0;
    color: #333;
    border-radius:10px;
    margin:auto;
    width: 700px;
    max-width: 70vw;
    position: relative;

    .close-btn {
      position: absolute;
      top: -1em;
      right: -1em;
      cursor: pointer;
      background-color: #fe252e;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .footer {
    .buttons {
      // margin:1.6em 0 0 0;
      display: flex;
      gap: .4em;
      justify-content: flex-end;
    }
  }
}
</style>
