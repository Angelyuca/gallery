<template>
  <div class="wrapper">
    <div class="block-search">
      <input v-model="emptySearch" ref="search" @keyup.enter="searchImgs" class="input-search" placeholder="Search...">
      <button class="close-icon" @click="clear" v-if="emptySearch.length"></button>
    </div>
    <div ref="gallery" class="block-gallery">
      <div class="gallery" @scroll="scroll" v-if="images.length && view">
        <div v-masonry transition-duration="1s" fit-width="true" gutter="13">
          <div v-masonry-tile class="image" v-for="(img, id) in images" :key="id">
            <img :src="img.urls.small"/>
          </div>
        </div>
      </div>
      <div v-else-if="!images.length && search.length" class="no-images">No images</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'galleryV',
  data() {
    return {
      page: 1,
      search: '',
      emptySearch: '',
      view: true
    }
  },
  created() {
    this.getImages()
  },
  computed: {
    images() {
      return this.$store.state.images
    }
  },
  methods: {
    async getImages() {
      await this.$store.dispatch("get", this.page)
      setTimeout(() => {
        this.view = true
      }, 100)
    },
    searchImgs(e) {
      this.view = false
      const valueSearch = e.srcElement.value
      if (valueSearch.length && (this.search !== valueSearch)) {
        this.search = valueSearch
        this.$refs.gallery.scrollTo(0, 0)
        this.page = 1
        this.getSearchImgs()
      }
    },
    async getSearchImgs() {
      let response = await this.$store.dispatch("search", {page: this.page, search: this.search})
      if (response.results.length) {
        setTimeout(() => {
          this.view = true
        }, 300)
      } else this.view = false
    },
    clear() {
      if (this.search.length) this.view = false
      this.$refs.search.value = ''
      this.emptySearch = ''
      this.search = ''
      this.page = 1
      this.getImages()
      this.$refs.gallery.scrollTo(0, 0)
    },
    scroll(e) {
      let valueScroll = e.target.scrollTop + e.target.offsetHeight
      if (valueScroll == e.target.scrollHeight) {
        this.page = ++this.page
        this.search.length ? this.getSearchImgs() : this.getImages()
      }
    }
  },
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  text-align: center;
}

.block-search {
  margin-bottom: 40px;
}

.input-search {
  width: 50%;
  height: calc(1rem + 2px);
  padding: 0.375rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: #212529;
    opacity: 0.4;
  }

  &:focus {
    color: #3d4145;
    background-color: #fff;
    border-color: #bdbdbd;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(193, 193, 193, 0.25);
  }

  &:disabled, &[readonly] {
    background-color: #f5f5f5;
    opacity: 1;
  }
}

.close-icon {
  margin-left: -14px;
  position: relative;
  border: 1px solid transparent;
  background-color: transparent;
  display: inline-block;
  vertical-align: middle;
  outline: 0;
  cursor: pointer;
}

.close-icon:after {
  content: "\2716";
  display: block;
  width: 15px;
  height: 15px;
  position: absolute;
  z-index: 1;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 2px;
  border-radius: 50%;
  text-align: center;
  color: #979797;
  font-weight: normal;
  font-size: 12px;
  cursor: pointer;
}

.block-gallery{
  display: flex;
  justify-content: center;
  width: 100%;
}

.gallery {
  width: inherit;
  display: flex;
  justify-content: center;
  overflow: auto;
  height: calc(100vh - 150px);
  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.image {
  margin-bottom: 10px;

  &:hover {
    transform: scale(1.02);
    transition: .5s;
  }

  img{
    width: inherit;
  }
}

.no-images {
  margin-top: 50px;
  font-size: 24px;
  text-align: center;
}

@media (max-width: 480px) {
  .image {
    width: 300px;
  }
  .input-search {
    width: 90%;
  }
}

</style>
