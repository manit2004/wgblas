CC = nvcc
BIN = bin

all: $(BIN)/alpha.sger $(BIN)/lda.sger $(BIN)/sger $(BIN)/stride.sger

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.sger: alpha.sger.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.sger.c -o $(BIN)/alpha.sger -lcublas

$(BIN)/lda.sger: lda.sger.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.sger.c -o $(BIN)/lda.sger -lcublas

$(BIN)/sger: sger.c ../../utils/helpers.h | $(BIN)
	$(CC) sger.c -o $(BIN)/sger -lcublas

$(BIN)/stride.sger: stride.sger.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.sger.c -o $(BIN)/stride.sger -lcublas

clean:
	rm -rf $(BIN)
