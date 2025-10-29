<template>
  <j-page-container>
    <div class="feedback-container">
      <pro-search
          :columns="columns"
          target="customer-feedback"
          @search="handleParams"
      />
      <FullPage>
        <j-pro-table
            ref="tableRef"
            :columns="columns"
            :request="getFeedbackList_api"
            mode="TABLE"
            :params="queryParams"
            :defaultParams="{
              sorts: [
                { name: 'createTime', order: 'desc' }
              ]
            }"
            :scroll="{ y: 'calc(100% - 60px)' }"
        >
          <template #headerLeftRender>
            <j-permission-button
              :hasPermission="`${permission}:query`"
              type="primary"
              @click="table.refresh"
            >
              <AIcon type="ReloadOutlined"/>
              {{ $t('Feedback.index.660348-0') }}
            </j-permission-button>
          </template>
          <template #status="slotProps">
            <j-badge-status
                :status="slotProps.status"
                :text="statusMap[slotProps.status] || slotProps.status"
                :statusNames="{
                  0: 'warning',
                  1: 'processing',
                  2: 'success',
                  3: 'default'
                }"
            ></j-badge-status>
          </template>
          <template #type="slotProps">
            <span>{{ typeMap[slotProps.type] }}</span>
          </template>
          <template #createTime="slotProps">
            <span>{{ formatDateTime(slotProps.createTime) }}</span>
          </template>
          <!-- <template #action="slotProps">
            <a-space :size="16">
              <j-permission-button
                  type="link"
                  :tooltip="{ title: '查看详情' }"
                  @click="table.viewDetail(slotProps)"
              >
                <AIcon type="EyeOutlined"/>
              </j-permission-button>
            </a-space>
          </template> -->
          <template #action="slotProps">
          <a-space>
            <template v-for="i in getActions(slotProps)" :key="i.key">
              <j-permission-button
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :hasPermission="`${permission}:` + i.key"
                :tooltip="{
                  ...i.tooltip,
                }"
                type="link"
                style="padding: 0; margin: 0"
                :danger="i.key === 'delete'"
                @click="i.onClick"
              >
                <template #icon>
                  <AIcon :type="i.icon" />
                </template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
        </j-pro-table>
      </FullPage>

      <a-modal
          v-model:visible="detailModal.visible"
          ref="saveRef"
          :title="title"
          width="800px"
          :footer="null"
      >
        <a-descriptions :column="1" bordered>
          <a-descriptions-item :label="$t('Feedback.index.660348-1')">
            {{ detailModal.data.creatorName }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-2')">
            {{ detailModal.data.email }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-3')">
            {{ typeMap[detailModal.data.type] }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-4')">
            <j-badge-status
                :status="detailModal.data.status"
                :text="statusMap[detailModal.data.status]"
                :statusNames="{
                  0: 'warning',
                  1: 'processing',
                  2: 'success',
                  3: 'default'
                }"
            ></j-badge-status>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-5')">
            {{ formatDateTime(detailModal.data.createTime) }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-6')">
            {{ detailModal.data.content }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-7')">
            {{ detailModal.data.description }}
          </a-descriptions-item>
        </a-descriptions>
      </a-modal>

      <a-modal
          v-model:visible="handleModal.visible"
          :title="$t('Feedback.index.660348-9')"
          width="800px"
          @ok="handleFeedback.submit"
          @cancel="handleFeedback.cancel"
          :confirmLoading="handleModal.loading"
      >
        <a-descriptions :column="1" bordered style="margin-bottom: 16px">
          <a-descriptions-item :label="$t('Feedback.index.660348-1')">
            {{ handleModal.data.creatorName }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-2')">
            {{ handleModal.data.email }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-3')">
            {{ typeMap[handleModal.data.type] }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-4')">
            <j-badge-status
                :status="handleModal.data.status"
                :text="statusMap[handleModal.data.status]"
                :statusNames="{
                  0: 'warning',
                  1: 'processing',
                  2: 'success',
                  3: 'default'
                }"
            ></j-badge-status>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-5')">
            {{ formatDateTime(handleModal.data.createTime) }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Feedback.index.660348-6')">
            {{ handleModal.data.content }}
          </a-descriptions-item>
        </a-descriptions>

        <a-form layout="vertical">
          <a-form-item :label="$t('Feedback.index.660348-4')" required>
            <a-radio-group v-model:value="handleModal.status">
              <a-radio :value="1">{{ $t('Feedback.index.660348-15') }}</a-radio>
              <a-radio :value="2">{{ $t('Feedback.index.660348-16') }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('Feedback.index.660348-7')" required>
            <a-textarea
                v-model:value="handleModal.description"
                :rows="4"
                :placeholder="$t('Feedback.index.660348-10')"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </j-page-container>
</template>

<script setup lang="ts" name="Feedback">
import { ref, reactive, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFeedbackList_api, close_api, handle_api } from '@customer/api/customer/feedback.ts';
import { onlyMessage } from "@jetlinks-web/utils";

const { t: $t } = useI18n();
const permission = 'customer/Feedback';
const saveRef = ref();

// 日期格式化函数
const formatDateTime = (timestamp: number | string | undefined): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const statusMap: Record<number, string> = {
  0: $t('Feedback.index.660348-14'),
  1: $t('Feedback.index.660348-15'),
  2: $t('Feedback.index.660348-16'),
  3: $t('Feedback.index.660348-17')
};

const typeMap: Record<string, string> = {
  feature: $t('Feedback.index.660348-24'),
  bug: $t('Feedback.index.660348-25'),
  question: $t('Feedback.index.660348-26'),
  other: $t('Feedback.index.660348-27')
};

const title = ref<string>("");

const getActions = (
  data: Partial<Record<string, any>>
): any[] => {
  if (!data) {
    return [];
  }
  const actions = [
    {
      key: "view",
      text: $t("Feedback.index.660348-12"),
      tooltip: {
        title: $t("Feedback.index.660348-12"),
      },
      icon: "EyeOutlined",
      onClick: () => {
        title.value = $t("Feedback.index.660348-12");
        table.viewDetail(data);
      },
    },
    {
      key: "update",
      text: $t("Feedback.index.660348-13"),
      disabled: data.status === 3,
      tooltip: {
        title:
          data.status === 3
            ? $t("Feedback.index.660348-20")
            : $t("Feedback.index.660348-21"),
      },
      icon: "EditOutlined",
      onClick: () => {
        nextTick(() => {
          handleFeedback.show(data);
        });
      },
    },
    {
      key: "delete",
      text: $t("Feedback.index.660348-20"),
      disabled: data.status === 3,
      tooltip: {
        title:
          data.status === 3
            ? $t("Feedback.index.660348-20")
            : $t("Feedback.index.660348-22"),
      },
      popConfirm: {
        title: $t("Feedback.index.660348-23"),
        onConfirm: () => {
          const response = close_api(data);
          response.then((resp: { status: number; }) => {
            if (resp.status === 200) {
              onlyMessage($t("Feedback.index.660348-18"));
              tableRef.value?.reload();
            } else {
              onlyMessage($t("Feedback.index.660348-19"), "error");
            }
          });
          return response;
        },
      },
      icon: "CloseOutlined",
    },
  ];
  //if (type === "card") return actions.filter((i: any) => i.key !== "view");
  return actions;
};

const columns = [
  {
    title: $t('Feedback.index.660348-1'),
    dataIndex: 'creatorName',
    key: 'creatorName',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Feedback.index.660348-2'),
    dataIndex: 'email',
    key: 'email',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Feedback.index.660348-3'),
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    search: {
      type: 'select',
      options: () => Object.entries(typeMap).map(([value, label]) => ({ label, value })),
    },
    scopedSlots: true,
  },
  {
    title: $t('Feedback.index.660348-6'),
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    search: {
      type: 'string',
    },
    width: 400,
  },
  {
    title: $t('Feedback.index.660348-4'),
    dataIndex: 'status',
    key: 'status',
    ellipsis: true,
    search: {
      type: 'select',
      options: () => Object.entries(statusMap).map(([value, label]) => ({ label, value })),
    },
    scopedSlots: true,
  },
  {
    title: $t('Feedback.index.660348-5'),
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
    search: {
      type: 'date',
    },
    scopedSlots: true,
  },
  {
    title: $t('Feedback.index.660348-11'),
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 300,
    scopedSlots: true,
  },
];

const queryParams = ref({});

const tableRef = ref<Record<string, any>>({});

const detailModal = reactive({
  visible: false,
  data: {} as any
});

const handleModal = reactive({
  visible: false,
  data: {} as any,
  description: '',
  status: 1,
  loading: false
});

const table = {
  viewDetail: (row: any) => {
    detailModal.data = { ...row };
    detailModal.visible = true;
  },
  refresh: () => {
    tableRef.value.reload();
  },
};

const handleFeedback = {
  show: (row: any) => {
    handleModal.data = { ...row };
    handleModal.description = row.description || '';
    handleModal.status = row.status === 0 ? 1 : (row.status === 1 || row.status === 2 ? row.status : 1);
    handleModal.visible = true;
  },
  submit: async () => {
    // Validate description is not empty
    if (!handleModal.description || handleModal.description.trim() === '') {
      onlyMessage($t('Feedback.index.660348-10'), 'warning');
      return;
    }

    handleModal.loading = true;
    try {
      const response = await handle_api({
        id: handleModal.data.id,
        description: handleModal.description,
        status: handleModal.status
      });
      if (response.status === 200) {
        onlyMessage($t("Feedback.index.660348-18"));

        // Update detail modal data if it's visible
        if (detailModal.visible && detailModal.data.id === handleModal.data.id) {
          detailModal.data.description = handleModal.description;
          detailModal.data.status = handleModal.status;
        }

        handleModal.visible = false;
        tableRef.value?.reload();
      } else {
        onlyMessage($t("Feedback.index.660348-19"), "error");
      }
    } catch (error) {
      onlyMessage($t("Feedback.index.660348-19"), "error");
    } finally {
      handleModal.loading = false;
    }
  },
  cancel: () => {
    handleModal.visible = false;
    handleModal.description = '';
    handleModal.status = 1;
  }
};

const handleParams = (params: any) => {
  queryParams.value = params;
};
</script>

<style lang="less" scoped>
.feedback-container {
  :deep(.ant-table-tbody) {
    .ant-table-cell {
      .ant-space-item {
        .ant-btn-link {
          padding: 0;
        }
      }
    }
  }
}
</style>
