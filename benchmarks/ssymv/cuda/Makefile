CC = nvcc
BIN = bin

all: $(BIN)/ssymv $(BIN)/lda.ssymv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssymv: ssymv.c ../../utils/helpers.h | $(BIN)
	$(CC) ssymv.c -o $(BIN)/ssymv -lcublas

$(BIN)/lda.ssymv: lda.ssymv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssymv.c -o $(BIN)/lda.ssymv -lcublas

clean:
	rm -rf $(BIN)
