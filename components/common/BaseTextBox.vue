<template>
	<div class="text-box" :class="{ 'invalid': error }">
		<label>
			<div class="text-box-wrapper">
				<header class="header" style="display:flex; align-items:center; padding-right:1em;">
					<div v-if="label" class="caption-container" style="flex:auto 1 1;">
						<span class="caption">{{ label }}</span>
					</div>
					<div v-if="error" class="error-container" style="display:flex; gap:.2em; justify-content:flex-end; font-size:14px; color:red; opacity:.6; line-height:1.4em;">
						<v-icon icon="mdi-alert-decagram" size="1.2em"></v-icon>
						<span class="error-message">{{ error }}</span>
					</div>
				</header>
				<div class="c-text-box" :class="[{ 'disabled': disabled }]">
					<v-icon v-if="appendIcon" class="append-icon" :icon="appendIcon" size="1.4em"></v-icon>
					<input :type="type" :placeholder="placeholder" :value="modelValue ?? ''" @input="onInput" :disabled="disabled">
					<v-icon v-if="password" :icon="hideValue ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" size="1.4em" @click="hideValue = !hideValue"></v-icon>
					<!-- <baseButton prepend-icon="mdi-content-copy">Параметры</baseButton> -->
				</div>
			</div>
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BaseTextBox',
	emits: [ 'update:modelValue' ],
	props: {
		modelValue: [ String, Number ] as any,
		label: String,
    disabled: { type: Boolean, default: false },
		appendIcon: String,
		placeholder: String,
		password: { type: Boolean, default: false }, //TODO: удалить
		type: { type: String, default: 'text' },
		error: String
	},
	data() {
		return {
			hideValue: false
		};
	},
	methods: {
		onInput(event: Event) {
			this.$emit('update:modelValue', (event.target as any)?.value ?? '');
		}
	},
	created() {
		this.hideValue = this.password;
	},
});
</script>

<style lang="scss">
.text-box {
  &:has(input.disabled) {
		pointer-events: none;
	}

	.text-box-wrapper {
		margin:0 0 .6em 0;

		.caption {
			font-size:14px;
			opacity:.6;
			line-height: 1.4em;
			margin-bottom: .4em;
		}
		.c-text-box {
			display: flex;
			align-items: center;
			white-space: nowrap;
			text-wrap: nowrap;
			font-size: 16px;
			background: #FFFFFF;
			border-radius: 6px;
			border: 1px solid #E0E2E791;
			line-height: 1.4em;
			font-weight: 500;
			box-shadow: none;
			padding: .4em .4em .4em .6em;

      &.disabled {
        //   opacity:.6;

        > input {
          pointer-events: none;
        }
      }

			&:focus-within {
				box-shadow: 0 0 0 2px #0079C1aa;
			}

			.v-icon {
				padding-top:.1em;
				margin-right:.3em;
				opacity:.8;

				// font-size: 1.4em;
				// display: flex;
				// align-items: center;
				// padding: 1em 2em 1em 2em;
				// margin-bottom: 0;
				// font-weight: 400;
				// color: #5c6873;
				// background-color: #f0f3f5;
				// border: 1px solid #e4e7ea;
				// border-radius: 0 5px 5px 0;
			}
			&>input {
				flex: auto 1 0;
				color: inherit;
				outline: none;
				font-size: 16px;
				box-sizing: border-box;
				background: transparent;
				// padding:.5em .7em;
				padding: 0.4em .4em;

				&::placeholder {
					font-weight: 300;
					opacity: .6;
				}
			}
		}

	}

	&.invalid {
		.c-text-box {
			border-color: red;
			border-style: dashed;
			color: red;

			// outline:1px dashed red;
			// color: red;
		}
	}
}
</style>
