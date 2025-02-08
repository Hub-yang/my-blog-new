<script>
import { ensureExt, isExternal, isMailto, isTel } from '../util'

export default {
  props: {
    item: {
      required: true,
    },
  },

  computed: {
    link() {
      return ensureExt(this.item.link)
    },

    exact() {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).includes(
          this.link,
        )
      }
      return this.link === '/'
    },
  },

  methods: {
    isExternal,
    isMailto,
    isTel,
    focusoutAction() {
      this.$emit('focusout')
    },
  },
}
</script>

<template>
  <router-link
    v-if="!isExternal(link)"
    class="nav-link"
    :to="link"
    :exact="exact"
    @focusout.native="focusoutAction"
  >
    {{ item.text }}
  </router-link>
  <a
    v-else
    :href="link"
    class="nav-link external"
    :target="isMailto(link) || isTel(link) ? null : '_blank'"
    :rel="isMailto(link) || isTel(link) ? null : 'noopener noreferrer'"
    @focusout="focusoutAction"
  >
    {{ item.text }}
    <OutboundLink />
  </a>
</template>
